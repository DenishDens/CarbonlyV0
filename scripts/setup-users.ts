import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function setupUsers() {
  try {
    // Create super admin user
    const { data: superAdminUser, error: superAdminError } = await supabase.auth.admin.createUser({
      email: 'superadmin@carbonly.ai',
      password: 'superadmin123!',
      email_confirm: true,
    })

    if (superAdminError) throw superAdminError

    // Create admin user
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@carbonly.ai',
      password: 'admin123!',
      email_confirm: true,
    })

    if (adminError) throw adminError

    // Create member user
    const { data: memberUser, error: memberError } = await supabase.auth.admin.createUser({
      email: 'member@carbonly.ai',
      password: 'member123!',
      email_confirm: true,
    })

    if (memberError) throw memberError

    // Get the organization ID
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('name', 'Carbonly HQ')
      .single()

    if (orgError) throw orgError

    // Create user profiles
    const { error: profileError } = await supabase.from('user_profiles').insert([
      {
        user_id: superAdminUser.user.id,
        organization_id: organization.id,
        role: 'admin',
        is_super_admin: true,
      },
      {
        user_id: adminUser.user.id,
        organization_id: organization.id,
        role: 'admin',
        is_super_admin: false,
      },
      {
        user_id: memberUser.user.id,
        organization_id: organization.id,
        role: 'member',
        is_super_admin: false,
      },
    ])

    if (profileError) throw profileError

    console.log('Users created successfully!')
    console.log('Super Admin:', superAdminUser.user.email)
    console.log('Admin:', adminUser.user.email)
    console.log('Member:', memberUser.user.email)
  } catch (error) {
    console.error('Error setting up users:', error)
  }
}

setupUsers() 