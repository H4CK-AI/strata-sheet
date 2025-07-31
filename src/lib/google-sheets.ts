import { GoogleAuth } from 'google-auth-library';
import { sheets_v4, google } from 'googleapis';

const SPREADSHEET_ID = '14dCJdtpNHdQAX10Cut3-sC6xfHXgiKXkkarBqrRx6JI';

// Service account credentials
const credentials = {
  type: "service_account",
  project_id: "noxvora",
  private_key_id: "8b94d9201255f76d10238ec4cca7f1c9367ce881",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIKuBM0CB6NlOF\nXUqVb1nxcN5j1XGEgUGqDwegP72B3XBOZ2atk1O6ev+PXNgq/Zkt1hhZ09yyCcZL\nDK1t0pcuFxdt1iIvNPaAlu+Or098l9KGz6wwV0muAjV91r1nIldjARtZwFFhT7tE\niY8W9EiKsDCU7Cb86ZJeaNl0nFp8B7Rp40qsG6jzXWP97lhPxn5939QkF4F7HbFN\nZHeNdey1FIjhNv+3YA8eUAhIGqpJ98mkONT0fJ3gYQDYE3tWAKgsUWfzfgYXcJAF\nxu/WJAbW03N/ugHwQYtvZFywcGoiyJOl3ZcWCt094AYz20quDruHiF8xVC6znwjS\niGuX97k9AgMBAAECggEACwi3Xe9IewmCR83BY29vSSyW9cXkVhDnVRUzBGsUapOR\nsfYSkOrtffrIb6yx4Id46YVDHmCGv+xjWUEU+61/gUjrP7YYIvthGJbkFGd8PZAD\nnkQrEmxytqbkhU/7F4kAbDK5a+nQEp8vNt37sfY8Bs546cdYIYT2o+xVCw/mD67R\nZyfp2vpGeN74attLjzrnU/mcH3DJepcc7K6YZGr4zEcmebnT9g1Mlqvs+H4lBSaC\nrkSovFAXwa4No7UgzqfALkrtfNVx++6xf12nwgghcZhjtH07h4hUd1IVDswNPUZ/\nVddI131OTP9TsGduNFLfb9FSQeb7NPrb6OlVr92eeQKBgQDrf0UMnJ7jExDYrQjK\nXIvLR1EtaPdSdJ+6u7N5Nb9tKeWBpW1D/PdQ/xz1thUSeIIYt47A4kJ1+3USgd1v\nE6z1WApKvPFZS9NgB9rivAsHG+0v6IgtZFwWgH/1gsY8JiWUb0/cRF88fB+FHXXH\nVie+9Ikz6SFefiA6G/IrHdqHJwKBgQDZmC73CoSPOzsFWi0khI6/9AW9SPlJSdDn\n5EF5tkmdmFIHH8y7T75kjf2rCQmwt469q/GHylyjEW+wCubJtiuIEqbvT8Hns7WO\nnJ42abT6sddKeQkbZro7LpTqorJxuy3XviOf+nnx8WXApV0PnrAP5OgQFDFRRk77\nzC60OjLa+wKBgEvtasvYK3o3CXVyxKTKFeBijA/CCguxwlYocoMgCyodGfwk5AfJ\npcudlS67mCuuYvOpKwORb7AudN6UtFo908P+sMLMDFyoD+ykW7RCwKN4I48Qv+cy\ntmYi5B66HUQDYJZtFSiFetc7hcYba3/rjUEKArqT7chTjfxuSjQQmgZ9AoGAedZU\ntc8V2n131s9fZ4sxwxmH/SzXKMpERxPv9Y60OaIIjCSqJlfIa9V1rEcrPeAJ9PpK\nC5aruEMTHqd8AoYWaeLHxkgKcwqVJn1buWwHAjiCLBkJmGY08N5sU9U1xajhSmQU\n3ocJsQdRykTNjulz+/JYXmhwFOohX6w8mn3b6/ECgYEAy1W1Y91HO4rHt0+Af1kz\nAZmY0pACRPBMoOGiMB3pevff5UCcKyGm6TuiN38xisM+AmBqvJjXHF9c3/Du7p+T\ndFP4xj0p7VZsXpEvcKeiY3fjQsay63zqTqw40z+Bop/7ReGl7wZvZB9Qjx2ZNntb\nJp/4/Y+Go9MB14qM6IRCmoo=\n-----END PRIVATE KEY-----\n",
  client_email: "noxvora@noxvora.iam.gserviceaccount.com",
  client_id: "103817337477503752282",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/noxvora%40noxvora.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private auth: GoogleAuth;

  constructor() {
    this.auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async readSheet(range: string): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error('Error reading sheet:', error);
      throw error;
    }
  }

  async writeSheet(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Error writing to sheet:', error);
      throw error;
    }
  }

  async appendSheet(range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Error appending to sheet:', error);
      throw error;
    }
  }

  async createSheet(title: string): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title,
              },
            },
          }],
        },
      });
    } catch (error) {
      console.error('Error creating sheet:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();

// Sheet configurations for different modules
export const SHEET_CONFIGS = {
  clients: {
    range: 'Clients!A:H',
    headers: ['ID', 'Name', 'Email', 'Status', 'Source', 'Value', 'Last Contact', 'Created']
  },
  team: {
    range: 'Team!A:G',
    headers: ['ID', 'Name', 'Role', 'Salary', 'Status', 'Performance', 'Joined']
  },
  finance: {
    range: 'Finance!A:F',
    headers: ['ID', 'Type', 'Amount', 'Description', 'Date', 'Client']
  },
  kpis: {
    range: 'KPI!A:D',
    headers: ['Metric', 'Value', 'Target', 'Date']
  }
};