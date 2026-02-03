const pool = require('../config/database');

async function showAllTables() {
  const connection = await pool.getConnection();
  
  try {
    console.log('\n========================================');
    console.log('📊 HEART BUDDY DATABASE TABLES');
    console.log('========================================\n');

    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database');
      return;
    }

    console.log(`Found ${tables.length} tables:\n`);

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📋 TABLE: ${tableName.toUpperCase()}`);
      console.log(`${'='.repeat(50)}`);

      // Get table structure
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      console.log('\n🔧 STRUCTURE:');
      console.table(columns.map(col => ({
        Field: col.Field,
        Type: col.Type,
        Null: col.Null,
        Key: col.Key,
        Default: col.Default,
        Extra: col.Extra
      })));

      // Get row count
      const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      const rowCount = countResult[0].count;
      console.log(`\n📊 Total Rows: ${rowCount}`);

      // Show sample data if exists
      if (rowCount > 0) {
        const limit = Math.min(rowCount, 5);
        const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT ${limit}`);
        console.log(`\n💾 SAMPLE DATA (showing ${limit} of ${rowCount} rows):`);
        console.table(rows);
      } else {
        console.log('\n⚠️  No data in this table');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database inspection complete!');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Error reading database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to MySQL. Make sure MySQL server is running!');
      console.error('   Run: mysql -u root -p');
    }
  } finally {
    connection.release();
    process.exit(0);
  }
}

showAllTables();
