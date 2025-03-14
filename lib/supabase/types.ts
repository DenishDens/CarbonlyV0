export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Schema: {
      billing_history: {
        id: string
        organization_id: string
        subscription_id: string
        amount: number
        currency: string
        status: "paid" | "pending" | "failed"
        invoice_url: string | null
        billing_date: string
        created_at: string
        updated_at: string | null
      }
    }
    Tables: {
      billing_history: {
        Row: {
          id: string
          organization_id: string
          subscription_id: string
          amount: number
          currency: string
          status: "paid" | "pending" | "failed"
          invoice_url: string | null
          billing_date: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          subscription_id: string
          amount: number
          currency?: string
          status: "paid" | "pending" | "failed"
          invoice_url?: string | null
          billing_date: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          subscription_id?: string
          amount?: number
          currency?: string
          status?: "paid" | "pending" | "failed"
          invoice_url?: string | null
          billing_date?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price: number
          interval: "month" | "year"
          features: Json
          max_users: number
          stripe_price_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          price: number
          interval?: "month" | "year"
          features?: Json
          max_users?: number
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          price?: number
          interval?: "month" | "year"
          features?: Json
          max_users?: number
          stripe_price_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          organization_id: string
          plan_id: string
          status: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "incomplete_expired"
          current_period_start: string
          current_period_end: string | null
          cancel_at_period_end: boolean
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          plan_id: string
          status?: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "incomplete_expired"
          current_period_start: string
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          plan_id?: string
          status?: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "incomplete_expired"
          current_period_start?: string
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: "owner" | "admin" | "member"
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role?: "owner" | "admin" | "member"
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: "owner" | "admin" | "member"
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          code: string
          status: "draft" | "active" | "in_progress" | "completed" | "archived"
          progress: number
          project_type: "business_unit" | "project"
          parent_id: string | null
          user_id: string
          location: string | null
          start_date: string | null
          end_date: string | null
          target_reduction: number | null
          is_joint_venture: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          code: string
          description?: string | null
          status?: "draft" | "active" | "in_progress" | "completed" | "archived"
          progress?: number
          project_type?: "business_unit" | "project"
          parent_id?: string | null
          user_id: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          target_reduction?: number | null
          is_joint_venture?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          code?: string
          description?: string | null
          status?: "draft" | "active" | "in_progress" | "completed" | "archived"
          progress?: number
          project_type?: "business_unit" | "project"
          parent_id?: string | null
          user_id?: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          target_reduction?: number | null
          is_joint_venture?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      incidents: {
        Row: {
          id: number
          title: string
          description: string | null
          business_unit_id: string | null
          project_id: string | null
          type_id: string
          severity: "low" | "medium" | "high"
          status: "open" | "in_progress" | "resolved"
          reported_on: string
          resolved_at: string | null
          resolution_comment: string | null
          organization_id: string
          created_at: string
          updated_at: string | null
          created_by: string | null
          updated_by: string | null
          resolved_by: string | null
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          business_unit_id?: string | null
          project_id?: string | null
          type_id: string
          severity: "low" | "medium" | "high"
          status?: "open" | "in_progress" | "resolved"
          reported_on?: string
          resolved_at?: string | null
          resolution_comment?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          resolved_by?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          business_unit_id?: string | null
          project_id?: string | null
          type_id?: string
          severity?: "low" | "medium" | "high"
          status?: "open" | "in_progress" | "resolved"
          reported_on?: string
          resolved_at?: string | null
          resolution_comment?: string | null
          organization_id?: string
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_business_unit_id_fkey"
            columns: ["business_unit_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      incident_types: {
        Row: {
          id: string
          name: string
          description: string | null
          organization_id: string
          created_at: string
          updated_at: string | null
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          organization_id: string
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          organization_id?: string
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_billing_history: {
        Args: {
          org_id: string
        }
        Returns: Array<{
          id: string
          organization_id: string
          subscription_id: string
          amount: number
          currency: string
          status: "paid" | "pending" | "failed"
          invoice_url: string | null
          billing_date: string
          created_at: string
          updated_at: string | null
        }>
      }
      get_project_total_emissions: {
        Args: {
          project_ids: string[]
        }
        Returns: Array<{
          project_id: string
          total_emissions: number
        }>
      }
    }
    Views: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
