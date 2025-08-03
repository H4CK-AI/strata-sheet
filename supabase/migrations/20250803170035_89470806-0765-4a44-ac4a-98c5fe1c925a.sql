-- Create transactions table for detailed transaction history
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    mode TEXT NOT NULL DEFAULT 'Bank' CHECK (mode IN ('Bank', 'Credit Card', 'UPI', 'Cash')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Received', 'Paid')),
    client_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Enable all access for transactions" 
ON public.transactions 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();