export interface Database {
  public: {
    Tables: {
      jokes: {
        Row: {
          id: number
          original: string
          status: string
          rating: number
          tags: string
          created_at: string
        }
        Insert: {
          id?: number
          original: string
          status?: string
          rating?: number
          tags?: string
          created_at?: string
        }
        Update: {
          id?: number
          original?: string
          status?: string
          rating?: number
          tags?: string
          created_at?: string
        }
      }
      joke_versions: {
        Row: {
          id: number
          joke_id: number
          text: string
          type: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: number
          joke_id: number
          text: string
          type: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: number
          joke_id?: number
          text?: string
          type?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
} 