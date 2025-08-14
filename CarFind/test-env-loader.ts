// Environment loader for tests
import { config } from 'dotenv';

// Load environment variables from .env.local
config({
  path: '.env.local',
});

console.log('🔧 Environment variables loaded from .env.local');
console.log(
  `✅ OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Missing'}`,
);
console.log(
  `✅ Auth Secret: ${process.env.AUTH_SECRET ? 'Configured' : 'Missing'}`,
);
console.log(
  `✅ Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing'}`,
);
console.log(
  `✅ Supabase Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}`,
);
console.log(
  `✅ Supabase Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing'}`,
);

// Now import and run the actual test
import('./test-supabase-client-config.js');
