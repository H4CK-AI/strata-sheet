const SPREADSHEET_ID = '14dCJdtpNHdQAX10Cut3-sC6xfHXgiKXkkarBqrRx6JI';

class GoogleSheetsService {
  private mockMode = true; // Using mock data for now due to API access limitations
  private mockData: Record<string, any[][]> = {
    'Clients': [
      ['ID', 'Name', 'Email', 'Status', 'Source', 'Value', 'Last Contact', 'Created'],
      ['1', 'Acme Corp', 'contact@acme.com', 'Active', 'Website', '50000', '2024-01-15', '2024-01-01'],
      ['2', 'TechStart Inc', 'hello@techstart.com', 'Lead', 'Referral', '25000', '2024-01-10', '2024-01-08'],
      ['3', 'Global Solutions', 'info@global.com', 'Dormant', 'LinkedIn', '75000', '2023-12-20', '2023-12-01'],
      ['4', 'InnovateLab', 'team@innovatelab.com', 'Active', 'Cold Outreach', '120000', '2024-01-25', '2024-01-20'],
      ['5', 'StartupX', 'founder@startupx.io', 'Lead', 'Social Media', '35000', '2024-01-12', '2024-01-05'],
    ],
    'Team': [
      ['ID', 'Name', 'Role', 'Salary', 'Status', 'Performance', 'Joined'],
      ['1', 'Alice Johnson', 'Frontend Developer', '75000', 'Active', '92', '2023-06-01'],
      ['2', 'Bob Smith', 'Backend Developer', '80000', 'Active', '88', '2023-04-15'],
      ['3', 'Carol Davis', 'UI/UX Designer', '70000', 'Active', '95', '2023-08-01'],
      ['4', 'David Wilson', 'Project Manager', '85000', 'On Leave', '87', '2023-03-01'],
      ['5', 'Emma Chen', 'DevOps Engineer', '82000', 'Active', '91', '2023-09-15'],
      ['6', 'Frank Miller', 'QA Engineer', '68000', 'Active', '89', '2023-07-10'],
    ],
    'Finance': [
      ['ID', 'Type', 'Amount', 'Description', 'Date', 'Client'],
      ['1', 'Income', '15000', 'Project Payment', '2024-01-15', 'Acme Corp'],
      ['2', 'Income', '8500', 'Consulting Fee', '2024-01-20', 'TechStart Inc'],
      ['3', 'Income', '25000', 'Monthly Retainer', '2024-01-25', 'InnovateLab'],
      ['4', 'Expense', '2500', 'Office Rent', '2024-01-01', ''],
      ['5', 'Expense', '1200', 'Software Licenses', '2024-01-05', ''],
      ['6', 'Income', '12000', 'Feature Development', '2024-01-28', 'Global Solutions'],
    ]
  };

  async readSheet(range: string): Promise<any[][]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sheetName = range.split('!')[0];
    return this.mockData[sheetName] || [];
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