export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          blood_type: 'O' | 'A' | 'B' | 'AB' | null
          rh: '+' | '-' | null
          last_donation_date: string | null
          location_lat: number | null
          location_lng: number | null
          radius_km: number | null
          availability_status: 'available' | 'unavailable' | null
          availability_reason: string | null
          medical_notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          blood_type?: 'O' | 'A' | 'B' | 'AB' | null
          rh?: '+' | '-' | null
          last_donation_date?: string | null
          location_lat?: number | null
          location_lng?: number | null
          radius_km?: number | null
          availability_status?: 'available' | 'unavailable' | null
          availability_reason?: string | null
          medical_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          blood_type?: 'O' | 'A' | 'B' | 'AB' | null
          rh?: '+' | '-' | null
          last_donation_date?: string | null
          location_lat?: number | null
          location_lng?: number | null
          radius_km?: number | null
          availability_status?: 'available' | 'unavailable' | null
          availability_reason?: string | null
          medical_notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      emergency_requests: {
        Row: {
          id: string
          requester_id: string | null
          blood_type: 'O' | 'A' | 'B' | 'AB'
          rh: '+' | '-'
          urgency: 'low' | 'medium' | 'high' | 'critical' | null
          units_needed: number | null
          location_lat: number | null
          location_lng: number | null
          radius_km: number | null
          status: 'open' | 'matched' | 'fulfilled' | 'canceled' | null
          patient_name: string | null
          patient_age: number | null
          hospital: string | null
          contact: string | null
          created_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          requester_id?: string | null
          blood_type: 'O' | 'A' | 'B' | 'AB'
          rh: '+' | '-'
          urgency?: 'low' | 'medium' | 'high' | 'critical' | null
          units_needed?: number | null
          location_lat?: number | null
          location_lng?: number | null
          radius_km?: number | null
          status?: 'open' | 'matched' | 'fulfilled' | 'canceled' | null
          patient_name?: string | null
          patient_age?: number | null
          hospital?: string | null
          contact?: string | null
          created_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          requester_id?: string | null
          blood_type?: 'O' | 'A' | 'B' | 'AB'
          rh?: '+' | '-'
          urgency?: 'low' | 'medium' | 'high' | 'critical' | null
          units_needed?: number | null
          location_lat?: number | null
          location_lng?: number | null
          radius_km?: number | null
          status?: 'open' | 'matched' | 'fulfilled' | 'canceled' | null
          patient_name?: string | null
          patient_age?: number | null
          hospital?: string | null
          contact?: string | null
          created_at?: string | null
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      request_matches: {
        Row: {
          id: string
          request_id: string | null
          donor_id: string | null
          distance_km: number | null
          score: number | null
          status: 'notified' | 'accepted' | 'declined' | 'en_route' | 'arrived' | null
          response_time_seconds: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          request_id?: string | null
          donor_id?: string | null
          distance_km?: number | null
          score?: number | null
          status?: 'notified' | 'accepted' | 'declined' | 'en_route' | 'arrived' | null
          response_time_seconds?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          request_id?: string | null
          donor_id?: string | null
          distance_km?: number | null
          score?: number | null
          status?: 'notified' | 'accepted' | 'declined' | 'en_route' | 'arrived' | null
          response_time_seconds?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "emergency_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          donor_id: string | null
          scheduled_at: string
          location: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'canceled' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          scheduled_at: string
          location?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'canceled' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          scheduled_at?: string
          location?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'canceled' | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      donations: {
        Row: {
          id: string
          donor_id: string | null
          request_id: string | null
          volume_ml: number | null
          donated_at: string | null
          status: 'recorded' | 'verified' | null
          confirmation_token: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          qr_code_url: string | null
          token_expires_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          request_id?: string | null
          volume_ml?: number | null
          donated_at?: string | null
          status?: 'recorded' | 'verified' | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          qr_code_url?: string | null
          token_expires_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          request_id?: string | null
          volume_ml?: number | null
          donated_at?: string | null
          status?: 'recorded' | 'verified' | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          qr_code_url?: string | null
          token_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "emergency_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      hospitals: {
        Row: {
          id: string
          name: string
          location_lat: number | null
          location_lng: number | null
          contact_phone: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location_lat?: number | null
          location_lng?: number | null
          contact_phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location_lat?: number | null
          location_lng?: number | null
          contact_phone?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      medical_history: {
        Row: {
          id: string
          donor_id: string | null
          record_type: 'donation' | 'health_check' | 'vaccination' | 'medication' | 'allergy'
          title: string
          description: string | null
          date_recorded: string
          doctor_name: string | null
          clinic_name: string | null
          file_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string | null
          record_type: 'donation' | 'health_check' | 'vaccination' | 'medication' | 'allergy'
          title: string
          description?: string | null
          date_recorded: string
          doctor_name?: string | null
          clinic_name?: string | null
          file_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string | null
          record_type?: 'donation' | 'health_check' | 'vaccination' | 'medication' | 'allergy'
          title?: string
          description?: string | null
          date_recorded?: string
          doctor_name?: string | null
          clinic_name?: string | null
          file_url?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: 'emergency_request' | 'appointment_reminder' | 'donation_reminder' | 'system_update'
          title: string
          message: string
          data: Json | null
          read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'emergency_request' | 'appointment_reminder' | 'donation_reminder' | 'system_update'
          title: string
          message: string
          data?: Json | null
          read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'emergency_request' | 'appointment_reminder' | 'donation_reminder' | 'system_update'
          title?: string
          message?: string
          data?: Json | null
          read?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_request: {
        Args: {
          request_id_input: string
          donor_id_input: string
        }
        Returns: undefined
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

type DatabaseWithoutInternals = Database

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
