// Google Apps Script — contact form backend for weblyft-design
// Paste into: Google Sheet -> Extensions -> Apps Script
// Sheet headers (row 1): Timestamp | Name | Email | Subject | Message
// After pasting: set SHEET_ID, run doPost once to authorize, then deploy as a NEW version.

const SHEET_ID = '1WNGV90rNpI5pr9sJ2sis2MH9pKaRmbA4CYplTo1lEwQ'
const YOUR_EMAIL = 'weblyft.admin@gmail.com'

function doPost(e) {
  try {
    const d = e.parameter
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
    sheet.appendRow([
      new Date(),
      d.name || '',
      d.email || '',
      d.subject || '',
      d.message || ''
    ])
    const body = `Name: ${d.name}\nEmail: ${d.email}\nSubject: ${d.subject}\nMessage: ${d.message}`
    MailApp.sendEmail(YOUR_EMAIL, 'New enquiry', body)
    return ContentService.createTextOutput(JSON.stringify({success:true}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin','*');
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
