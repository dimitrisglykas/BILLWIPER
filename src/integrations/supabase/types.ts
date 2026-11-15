export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bill_codes: {
        Row: {
          bill_id: string
          owner_id: string
          rf_code: string
        }
        Insert: {
          bill_id: string
          owner_id: string
          rf_code: string
        }
        Update: {
          bill_id?: string
          owner_id?: string
          rf_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_codes_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: true
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number
          city: string
          created_at: string
          demo_remaining: number | null
          due_date: string | null
          first_name: string
          id: string
          is_demo: boolean
          note: string
          owner_id: string | null
          provider: string
          public_description: string
          status: string
        }
        Insert: {
          amount: number
          city: string
          created_at?: string
          demo_remaining?: number | null
          due_date?: string | null
          first_name: string
          id?: string
          is_demo?: boolean
          note: string
          owner_id?: string | null
          provider: string
          public_description?: string
          status?: string
        }
        Update: {
          amount?: number
          city?: string
          created_at?: string
          demo_remaining?: number | null
          due_date?: string | null
          first_name?: string
          id?: string
          is_demo?: boolean
          note?: string
          owner_id?: string | null
          provider?: string
          public_description?: string
          status?: string
        }
        Relationships: []
      }
      demo_leaders: {
        Row: {
          bill_count: number
          city: string
          id: number
          is_public_demo: boolean
          total_amount: number
          username: string
          weekly_amount: number
        }
        Insert: {
          bill_count: number
          city: string
          id: number
          is_public_demo?: boolean
          total_amount: number
          username: string
          weekly_amount: number
        }
        Update: {
          bill_count?: number
          city?: string
          id?: number
          is_public_demo?: boolean
          total_amount?: number
          username?: string
          weekly_amount?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          id: string
          payer_id: string
          receipt_path: string
          status: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          id?: string
          payer_id: string
          receipt_path: string
          status?: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          id?: string
          payer_id?: string
          receipt_path?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string
          id: string
          username: string
        }
        Insert: {
          city?: string
          id: string
          username: string
        }
        Update: {
          city?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      wipes: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          id: string
          is_demo: boolean
          request_id: string
          user_id: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          id?: string
          is_demo?: boolean
          request_id: string
          user_id: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wipes_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      billwiper_leaders: {
        Args: { weekly?: boolean }
        Returns: {
          bill_count: number
          city: string
          total_amount: number
          username: string
        }[]
      }
      demo_wipe_rankings: {
        Args: never
        Returns: {
          bill_count: number
          total_amount: number
          username: string
          weekly_amount: number
        }[]
      }
      demo_wipe_total: { Args: never; Returns: number }
      record_demo_wipe: {
        Args: { p_amount: number; p_bill_id: string; p_request_id: string }
        Returns: number
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
