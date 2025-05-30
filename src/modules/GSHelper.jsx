import Constants from '../config/constants.jsx'

const Papa = require("papaparse")

function GetSheetsData() {
    return new Promise((resolve) => {
        Papa.parse(Constants.GOOGLE_SHEETS_DB_URL, {
            download: true,
            header: true,
            newline: "",
            complete: function(results, file) {
                resolve(results.data)
            }
        })
    })
}


export default GetSheetsData