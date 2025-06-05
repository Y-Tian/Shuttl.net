import requests
import re
from PIL import Image
import io
from random import uniform
import time
from datetime import datetime
import boto3
import os
from logging import getLogger, INFO, basicConfig
from bs4 import BeautifulSoup
import json

# Configure logging
basicConfig(level=INFO, format='%(asctime)s - %(levelname)s - %(message)s')
log = getLogger(__name__)

"""
TODO:
- add watermark to image
"""

# Cloudflare R2 Configuration - set as environment variables
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
BUCKET_NAME = "shuttl"

def pull_dataset():
    url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdzzVMPVgDhJ06QHuf93MI8aCm7l3o9RDhTGcXILjrAwEBbDP63iWRZdOZ7773JZOqMOz3c6Xs0ksk/pub?output=csv"
    response = requests.get(url)
    return response.text

def asset_index_builder(dataset):
    """
    Builds an index of assets from the dataset.
    The dataset is expected to be a CSV string.
    """
    lines = dataset.strip().split('\n')
    headers = lines[0].split(',')
    asset_indexes = []

    for line in lines[1:]:
        values = line.split(',')
        asset = {}
        for i, header in enumerate(headers):
            asset[header] = values[i]
        asset_payload = {
            'year': asset.get('year', '').strip(),
            'brand': asset.get('brand', '').strip(),
            'subModel': asset.get('subModel', '').strip(),
            'query': f"{asset.get('brand', '').strip()} {asset.get('subModel', '').strip()}",
            'index': f"{asset.get('year', '').strip()}_{asset.get('brand', '').strip().lower()}_{asset.get('subModel', '').strip().lower().replace(' ', '_')}"
        }
        asset_indexes.append(asset_payload)

    return asset_indexes

def already_uploaded_to_r2(filename):
    """
    Checks if a file has already been uploaded to the Cloudflare R2 bucket.
    """
    try:
        s3 = boto3.client(
            's3',
            endpoint_url=f'https://{CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        s3.head_object(Bucket=BUCKET_NAME, Key=filename)
        log.info(f"{filename} already exists in R2 bucket {BUCKET_NAME}")
        return True
    except s3.exceptions.ClientError as e:
        if e.response['Error']['Code'] == '404':
            return False
        else:
            log.info(f"Error checking {filename} in R2: {e}")
            return False

def upload_to_r2(filename, data):
    """
    Uploads data to Cloudflare R2 bucket.
    """
    try:
        s3 = boto3.client(
            's3',
            endpoint_url=f'https://{CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        s3.put_object(Bucket=BUCKET_NAME, Key=filename, Body=data)
        log.info(f"Uploaded {filename} to R2 bucket {BUCKET_NAME}")
        return True
    except Exception as e:
        log.info(f"Failed to upload {filename} to R2: {e}")
        return False
    
def process_li_ning(query, index):
    """
    Processes a Li-Ning query to download the first image and upload it to R2.
    """
    search_prepend = "lining.studio"
    query = f"{search_prepend} {query}"
    search_key = "lining.studio"

    log.info(f"Processing Li-Ning query: {query}")

    # Get the first result URL from the search
    url = get_search_first_result(query, search_key)
    if url is None:
        log.info(f"Failed to find first result for {query}. Skipping...")
        return None

    """
    Scrapes the second <script type="application/ld+json"> from the given URL,
    parses the JSON, and returns the value of the 'image' key.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        log.info(f"Failed to fetch page: {url}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    scripts = soup.find_all("script", type="application/ld+json")
    if len(scripts) < 2:
        log.info("Less than 2 <script type='application/ld+json'> elements found.")
        return None

    try:
        data = json.loads(scripts[1].string)
        image_url = data.get("image")
        if isinstance(image_url, list):
            image_url = image_url[-1]  # Get the last image URL if it's a list
        log.info(f"Found Li-Ning image URL: {image_url}")
        
        img_data = requests.get(image_url, headers=headers).content
        img_data = add_watermark_and_logo(img_data, watermark_text="shuttl.net", logo_path="shuttl.png")
        if img_data is None:
            log.info(f"Failed to add watermark/logo for {query}. Skipping...")
            return

        # Save the rotated image data to a file
        filename = index + ".webp"
        
        # Upload the image to Cloudflare R2
        try:
            upload_to_r2(filename, img_data)
        except Exception as e:
            log.info(f"Error uploading image for {query}: {e}")
    except Exception as e:
        log.info(f"Error parsing JSON or extracting image: {e}")
        return None
    
def process_yonex(query, index):
    """
    Processes a Yonex query to download the first image and upload it to R2.
    """
    search_prepend = "sunriseclick"
    query = f"{search_prepend} {query}"
    search_key = "cdn-sunriseclick"

    log.info(f"Processing query: {query}")

    # Download the first image for the asset
    img_data = download_first_image(query, search_key)
    if img_data is None:
        log.info(f"Failed to download image for {query}. Skipping...")
        return

    # Rotate the image 90 degrees clockwise
    img_data = rotate_webp_data_clockwise(img_data, degrees=270)
    if img_data is None:
        log.info(f"Failed to rotate image for {query}. Skipping...")
        return

    img_data = add_watermark_and_logo(img_data, watermark_text="shuttl.net", logo_path="shuttl.png")
    if img_data is None:
        log.info(f"Failed to add watermark/logo for {query}. Skipping...")
        return

    # Save the rotated image data to a file
    filename = index + ".webp"
    
    # Upload the image to Cloudflare R2
    try:
        upload_to_r2(filename, img_data)
    except Exception as e:
        log.info(f"Error uploading image for {query}: {e}")

def download_runner(asset_indexes):
    for i, asset in enumerate(asset_indexes):
        log.info(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Processing asset {i + 1}/{len(asset_indexes)}: {asset}")

        brand = asset['brand']
        query = asset['query']
        index = asset['index']

        # Check if the asset has already been uploaded to R2
        filename = f"{index}.webp"
        if already_uploaded_to_r2(filename):
            log.info(f"Skipping {filename} as it has already been uploaded.")
            continue

        # TODO: Implement logic to handle different brands, only processing Yonex for now
        if brand == "Yonex":
            process_yonex(query, index)
        elif brand == "Li-Ning":
            process_li_ning(query, index)
        else:
            continue

def get_search_first_result(query, search_key):
    """
    Downloads the first webpage result HTML from a Google search result.
    Args:
        query (str): The search query.
        search_key (str): A key to identify the image URL in the HTML.
    Returns:
        str: The HTML content of the first search result page.
    """

    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}&num=1"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(search_url, headers=headers)
    if response.status_code != 200:
        log.info("Failed to fetch search results")
        return None

    html = response.text
    print(html)
    matches = re.findall(fr'https?://[^"]*{search_key}[^"]+', html)

    if not matches:
        log.info("No matching URL found.")
        return None

    first_url = matches[0]
    log.info(f"Found URL: {first_url}")
    
    return first_url

def download_first_image(query, search_key):
    random_buffer = uniform(0.1, 3)  # Random delay between 0.1 and 1.5 seconds
    time.sleep(random_buffer)  # Random delay to avoid rate limiting

    search_url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(search_url, headers=headers)
    if response.status_code != 200:
        log.info("Failed to fetch search results")
        return

    html = response.text
    matches = re.findall(fr'https?://[^"]*{search_key}[^"]+', html)

    if not matches:
        log.info("No matching URL found.")
        return

    first_url = matches[0]
    log.info(f"Found image URL: {first_url}")

    try:
        img_data = requests.get(first_url, headers=headers).content
        return img_data  # Return the image data instead of saving it
    except Exception as e:
        log.info(f"Failed to download image: {e}")
        return None

def rotate_webp_data_clockwise(input_image_data, degrees=90):
    """
    Rotates WebP image data by a specified number of degrees clockwise.

    Args:
        input_image_data (bytes): The raw bytes of the input WebP image.
        degrees (int): The number of degrees to rotate clockwise (e.g., 90, 180, 270).

    Returns:
        bytes: The raw bytes of the rotated WebP image.
               Returns None if an error occurs.
    """
    try:
        # Use BytesIO to treat the input bytes as a file-like object
        image_stream = io.BytesIO(input_image_data)

        # Open the image from the BytesIO stream
        with Image.open(image_stream) as img:
            # Rotate the image clockwise
            if degrees == 90:
                rotated_img = img.transpose(Image.ROTATE_90)
            elif degrees == 180:
                rotated_img = img.transpose(Image.ROTATE_180)
            elif degrees == 270:
                rotated_img = img.transpose(Image.ROTATE_270)
            else:
                rotated_img = img.rotate(-degrees, expand=True, resample=Image.BICUBIC)

            # Save the rotated image into a new BytesIO stream as WebP
            output_stream = io.BytesIO()
            rotated_img.save(output_stream, format="WEBP")

            # Get the bytes from the output stream
            rotated_image_data = output_stream.getvalue()

            return rotated_image_data

    except Exception as e:
        log.info(f"An error occurred during image rotation: {e}")
        return None
    
def add_watermark_and_logo(image_data, watermark_text="shuttl.net", logo_path="shuttl.png"):
    """
    Adds a large, centered semi-transparent text watermark and a logo at 3/4 width and 3/4 height.
    Args:
        image_data (bytes): The raw bytes of the input image.
        watermark_text (str): The text to use as a watermark.
        logo_path (str): Path to the logo image (PNG with transparency recommended).
    Returns:
        bytes: The raw bytes of the processed image.
    """
    try:
        image_stream = io.BytesIO(image_data)
        with Image.open(image_stream).convert("RGBA") as base:
            width, height = base.size

            # --- Add large, centered watermark text ---
            txt_layer = Image.new("RGBA", base.size, (255,255,255,0))
            from PIL import ImageDraw, ImageFont
            draw = ImageDraw.Draw(txt_layer)

            # Try to use a large TTF font, fallback to default
            font_size = int(height * 0.05)
            font = None
            font_paths = [
                "arial.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/Library/Fonts/Arial.ttf",
                "/usr/share/fonts/truetype/freefont/FreeSans.ttf"
            ]
            for path in font_paths:
                try:
                    font = ImageFont.truetype(path, font_size)
                    break
                except Exception:
                    continue
            if font is None:
                log.info("No TTF font found, using default font (may be small).")
                font = ImageFont.load_default()

            # Get text size
            try:
                bbox = draw.textbbox((0, 0), watermark_text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            except AttributeError:
                text_width, text_height = font.getsize(watermark_text)

            text_position = ((width - text_width) // 2, (height - text_height) // 2)

            # If using default font and text is too small, draw it multiple times to "scale up"
            if font == ImageFont.load_default() and text_height < height * 0.10:
                # Draw the watermark text multiple times to make it more visible
                for offset in range(-2, 3):
                    for offset2 in range(-2, 3):
                        draw.text(
                            (text_position[0] + offset, text_position[1] + offset2),
                            watermark_text,
                            font=font,
                            fill=(0, 0, 0, 70)
                        )
            else:
                draw.text(
                    text_position,
                    watermark_text,
                    font=font,
                    fill=(0, 0, 0, 70)
                )

            # --- Add logo at (3/4 width, 3/4 height) ---
            try:
                with Image.open(logo_path).convert("RGBA") as logo:
                    logo_ratio = logo.width / logo.height
                    logo_height = int(height * 0.10)
                    logo_width = int(logo_height * logo_ratio)
                    logo = logo.resize((logo_width, logo_height), Image.LANCZOS)
                    logo_x = int(width * 0.75)
                    logo_y = int(height * 0.75)
                    logo_x = min(logo_x, width - logo_width)
                    logo_y = min(logo_y, height - logo_height)
                    txt_layer.paste(logo, (logo_x, logo_y), logo)
            except Exception as e:
                log.info(f"Could not add logo: {e}")

            watermarked = Image.alpha_composite(base, txt_layer)
            output_stream = io.BytesIO()
            watermarked.convert("RGB").save(output_stream, format="WEBP")
            return output_stream.getvalue()
    except Exception as e:
        log.info(f"Failed to add watermark/logo: {e}")
        return image_data

if __name__ == "__main__":
    log.info("Starting the image download process...")
    start_t = time.time()

    dataset = pull_dataset()
    log.info(f"Dataset pulled successfully. Total time taken: {time.time() - start_t:.2f} seconds.")
    
    asset_indexes = asset_index_builder(dataset)
    log.info(f"Asset indexes built successfully. Total time taken: {time.time() - start_t:.2f} seconds.")

    download_runner(asset_indexes)
    log.info(f"Image download process completed. Total time taken: {time.time() - start_t:.2f} seconds.")

    log.info("All tasks completed successfully.")
