export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          contract_end: string | null
          created_at: string
          employees: number | null
          id: string
          industry: string
          name: string
          profitability: string | null
          revenue: string
          risk_score: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          contract_end?: string | null
          created_at?: string
          employees?: number | null
          id?: string
          industry: string
          name: string
          profitability?: string | null
          revenue: string
          risk_score?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          contract_end?: string | null
          created_at?: string
          employees?: number | null
          id?: string
          industry?: string
          name?: string
          profitability?: string | null
          revenue?: string
          risk_score?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      compliance: {
        Row: {
          category: string
          created_at: string
          description: string
          due_date: string
          id: string
          priority: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          priority?: string
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          id: string
          join_date: string
          name: string
          performance: number | null
          position: string
          salary: string
          skills: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          join_date: string
          name: string
          performance?: number | null
          position: string
          salary: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          join_date?: string
          name?: string
          performance?: number | null
          position?: string
          salary?: string
          skills?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      finance: {
        Row: {
          created_at: string
          expenses: string
          id: string
          month: string
          overhead: string | null
          profit: string
          revenue: string
          salaries: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expenses: string
          id?: string
          month: string
          overhead?: string | null
          profit: string
          revenue: string
          salaries?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expenses?: string
          id?: string
          month?: string
          overhead?: string | null
          profit?: string
          revenue?: string
          salaries?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          client_reference: string | null
          created_at: string
          date: string
          description: string
          id: string
          mode: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          client_reference?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          mode?: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          client_reference?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          mode?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
