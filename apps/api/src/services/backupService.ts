import { spawn } from 'child_process';
import { Readable } from 'stream';

/**
 * Executes pg_dump and returns a Readable stream of the compressed database dump.
 * Uses custom format (-F c) for compressed, efficient backups.
 */
export function executePgDump(dbUrl: string): Readable {
  console.log('🔄 Starting pg_dump process...');
  
  // In production, ensure postgresql-client is installed in the environment
  const pgDump = spawn('pg_dump', ['-d', dbUrl, '-F', 'c']);
  
  pgDump.stderr.on('data', (data) => {
    // pg_dump writes status info to stderr
    console.log(`[pg_dump] ${data.toString().trim()}`);
  });

  pgDump.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ pg_dump process exited with code ${code}`);
    } else {
      console.log(`✅ pg_dump process completed successfully.`);
    }
  });

  return pgDump.stdout;
}
