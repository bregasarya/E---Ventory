let db = openDatabase("E-Ventory", "1.0", "Data Barang", 2 * 1024 * 1024);
if (!db) {
  alert("Mohon Maaf, Database Tidak Terbuat");
} else {
  let version = db.version;
  console.log(version);
}

db.transaction((con) => {
  con.executeSql(
    "CREATE TABLE IF NOT EXISTS USER (" +
    "id INTEGER NOT NULL PRIMARY KEY ," +
    "nombre TEXT NOT NULL, apellido TEXT NOT NULL,edad INTEGER NOT NULL);"
  );
});

/* membuat table akun*/
db.transaction((con) => {
  con.executeSql(
    "CREATE TABLE IF NOT EXISTS AKUN (" +
    "username TEXT NOT NULL PRIMARY KEY ," +
    "email TEXT NOT NULL unique, password TEXT NOT NULL);"
  );
});

/* memasukan akun */
db.transaction((con) => {
  con.executeSql(
    `INSERT INTO AKUN VALUES ('admin','admin@gmail.com','12345678')`
  );
});

//register
$('#daftar').submit(function(e){
    e.preventDefault()
    const username = $('[name="username"]').val()
    const email = $('[name="email"]').val()
    const password = $('[name="password"]').val()
    db.transaction((con) => {
        con.executeSql(
            `INSERT INTO AKUN VALUES ('${username}','${email}','${password}')`, undefined, function(transaction,data){
                window.location='login.html'
            }, function(){
                alert('Email/Username telah dipakai')
            }
          );
      });
})