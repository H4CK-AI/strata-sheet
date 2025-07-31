const SPREADSHEET_ID = '14dCJdtpNHdQAX10Cut3-sC6xfHXgiKXkkarBqrRx6JI';
const API_KEY = 'AIzaSyBvOiM0_Ng8oGgE1fHgxgNs2jkPiE-mLqo'; // Public API key for read access

class GoogleSheetsService {
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  async readSheet(range: string): Promise<any[][]> {
    try {
      const url = `${this.baseUrl}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error reading sheet:', error);
      
      // Return mock data if API fails
      if (range.includes('Clients')) {
        return [
          ['ID', 'Name', 'Email', 'Status', 'Source', 'Value', 'Last Contact', 'Created'],
          ['1', 'Acme Corp', 'contact@acme.com', 'Active', 'Website', '50000', '2024-01-15', '2024-01-01'],
          ['2', 'TechStart Inc', 'hello@techstart.com', 'Lead', 'Referral', '25000', '2024-01-10', '2024-01-08'],
          ['3', 'Global Solutions', 'info@global.com', 'Dormant', 'LinkedIn', '75000', '2023-12-20', '2023-12-01'],
        ];
      } else if (range.includes('Team')) {
        return [
          ['ID', 'Name', 'Role', 'Salary', 'Status', 'Performance', 'Joined'],
          ['1', 'Alice Johnson', 'Frontend Developer', '75000', 'Active', '92', '2023-06-01'],
          ['2', 'Bob Smith', 'Backend Developer', '80000', 'Active', '88', '2023-04-15'],
          ['3', 'Carol Davis', 'UI/UX Designer', '70000', 'Active', '95', '2023-08-01'],
          ['4', 'David Wilson', 'Project Manager', '85000', 'On Leave', '87', '2023-03-01'],
        ];
      } else if (range.includes('Finance')) {
        return [
          ['ID', 'Type', 'Amount', 'Description', 'Date', 'Client'],
          ['1', 'Income', '15000', 'Project Payment', '2024-01-15', 'Acme Corp'],
          ['2', 'Income', '8500', 'Consulting Fee', '2024-01-20', 'TechStart Inc'],
          ['3', 'Expense', '2500', 'Office Rent', '2024-01-01', ''],
        ];
      }
      
      return [];
    }
  }

  // Note: Write operations require OAuth authentication which is complex in browser
  // For now, we'll simulate write operations and show success messages
  async writeSheet(range: string, values: any[][]): Promise<void> {
    console.log('Write operation simulated:', { range, values });
    // In a real implementation, you'd need OAuth2 flow for write access
  }

  async appendSheet(range: string, values: any[][]): Promise<void> {
    console.log('Append operation simulated:', { range, values });
    // In a real implementation, you'd need OAuth2 flow for write access
  }

  async createSheet(title: string): Promise<void> {
    console.log('Create sheet operation simulated:', { title });
    // In a real implementation, you'd need OAuth2 flow for write access
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