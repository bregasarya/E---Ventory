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

$(document).ready(function(){
  readData()
})

let chartPie = undefined
let chartBar = undefined
function readData(){
    db.transaction(function(transaction){
        var sql = `SELECT * FROM USER ORDER BY id DESC`;
        let no = 1;
        transaction.executeSql(sql, undefined, function(transaction, result){
            let data = {
                header:[],
                data:[],
            }
            console.log(result)
            if (result.rows.length) {
                for(let i = result.rows.length - 1; i > -1; i--){
                    let row = result.rows.item(i);
                    data.header.push(row.apellido)
                    data.data.push(row.edad)
                }
                setDataChart(data)
            } else{
              console.log("data tidak ada")
                $("#book-list .book").append('<tr><td> No Item Found</td></tr>');
            }
        });
    });
}

const setDataChart = (value) => {
    const data = {
      labels: value.header,
      datasets: [
        {
          label: value.header,
          backgroundColor: randomColor(value.header.length),
          borderColor: randomColor(value.header.length),
          data: value.data,
        },
      ],
    };
  
    if (chartBar) chartBar.destroy();
    if (chartPie) chartPie.destroy();
    console.log(data)
    // Atur data chart
    chartPie = new Chart($("#chartPie"), getConfig(data, "pie"));
    // Ubah legend menjadi data mahasiswa
    data.datasets[0].label = "Jumlah Barang";
    chartBar = new Chart($("#chartBar"), getConfig(data, "bar"));
  };
  
  // Untuk mendapatkan array warna random
  const randomColor = (length) => {
    let color = [];
    for (let i = 0; i < length; i++) {
      const colorTemp = `rgba(${Math.floor(Math.random() * 255)},
       ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  
      if (color.indexOf(colorTemp) === -1) {
        color.push(colorTemp);
      } else {
        i--;
      }
    }
    return color;
  };

// Mendapatkan config chart sesuai jenis
const getConfig = (data, type = "pie") => {
    const config = {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === "pie" ? true : false,
          },
        },
      },
    };
    return config;
  };
