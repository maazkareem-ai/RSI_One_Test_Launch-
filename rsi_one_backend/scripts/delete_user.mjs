import { supabaseAdmin } from '../config/supabase.js';

async function deleteUserByEmail(email) {
  try {
    // First, get all users to find the one with the email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.log(`User with email ${email} not found in Auth`);
      return;
    }

    console.log(`Found user: ${user.id} - ${user.email}`);

    // Delete the user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return;
    }

    console.log(`Successfully deleted user ${email} from Auth`);

  } catch (error) {
    console.error('Script error:', error);
  }
}

// Usage: node delete_user.mjs <email>
const email = process.argv[2];
if (!email) {
  console.log('Usage: node delete_user.mjs <email>');
  process.exit(1);
}

deleteUserByEmail(email);