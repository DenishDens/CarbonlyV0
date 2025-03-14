export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      materials: {
        Row: {
          id: string
          name: string
          description: string | null
          emission_factor: number
          unit_of_measurement: string
          category: string
          sub_category: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          emission_factor: number
          unit_of_measurement: string
          category: string
          sub_category?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          emission_factor?: number
          unit_of_measurement?: string
          category?: string
          sub_category?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emission_data: {
        Row: {
          id: string
          organization_id: string
          project_id: string
          material_id: string
          date: string
          quantity: number
          unit_of_measurement: string
          scope: "scope1" | "scope2" | "scope3"
          source: "manual" | "file_upload" | "integration"
          source_file: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          material_id: string
          date: string
          quantity: number
          unit_of_measurement: string
          scope: "scope1" | "scope2" | "scope3"
          source: "manual" | "file_upload" | "integration"
          source_file?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          material_id?: string
          date?: string
          quantity?: number
          unit_of_measurement?: string
          scope?: "scope1" | "scope2" | "scope3"
          source?: "manual" | "file_upload" | "integration"
          source_file?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emission_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emission_data_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          }
        ]
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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
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
          id: string
          organization_id: string
          project_id: string
          type_id: string
          title: string
          description: string | null
          status: "open" | "in_progress" | "resolved"
          priority: "low" | "medium" | "high"
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          type_id: string
          title: string
          description?: string | null
          status?: "open" | "in_progress" | "resolved"
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          type_id?: string
          title?: string
          description?: string | null
          status?: "open" | "in_progress" | "resolved"
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "incident_types"
            referencedColumns: ["id"]
          }
        ]
      }
      incident_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      emissions: {
        Row: {
          id: string
          organization_id: string
          project_id: string
          date: string
          total: number
          scope1: number
          scope2: number
          scope3: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          date: string
          total: number
          scope1: number
          scope2: number
          scope3: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          date?: string
          total?: number
          scope1?: number
          scope2?: number
          scope3?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      projects_with_emissions: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: "draft" | "in_progress" | "completed" | "archived"
          progress: number
          project_type: "business_unit" | "project"
          parent_id: string | null
          user_id: string
          created_at: string
          updated_at: string | null
          organization_name: string
          organization_created_at: string
          organization_updated_at: string | null
          scope1_emissions: number
          scope2_emissions: number
          scope3_emissions: number
          total_emissions: number
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
        Returns: {
          project_id: string
          total_emissions: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description: string | null
  status: "draft" | "active" | "in_progress" | "completed" | "archived"
  progress: number
  project_type: "business_unit" | "project"
  parent_id: string | null
  user_id: string
  created_at: string
  updated_at: string
  code: string
  location: string | null
  start_date: string | null
  end_date: string | null
  target_reduction: number | null
  is_joint_venture: boolean
}
