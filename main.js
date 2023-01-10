/*------ ----- membuat database objek database baru----- ------*/
let db = openDatabase("E-Ventory", "1.0", "Data Barang", 2 * 1024 * 1024);
if (!db) {
  alert("Mohon Maaf, Database Tidak Terbuat");
} else {
  let version = db.version;
  console.log(version);
}
/*------ ----- membuat table barang  ----- ------*/
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

const $Form = document.getElementById("form");
const $submit = document.getElementById("submit");
const btnupdate=document.getElementById("update");

/*------ ----- Menyimpan data ----- ------*/
const Guardar = () => {
  let id = document.getElementById("codigo").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;

  if (id == "" || nombre == "" || apellido == "" || edad == "") {
    alert("Harap Isi Semua Kolom")
  } else if (Math.sign(edad) === -1) {
    alert("Jangan Masukan Angka Negatif");
  } else {

    db.transaction((con) => {
      con.executeSql(
        "insert into USER (ID,NOMBRE,APELLIDO,EDAD) values (?,?,?,?)",
        [id, nombre, apellido, edad]
      );
    
    });
  }
  Listado();

};

const Listado = () => {
  let $table = document.getElementById("tabel");
  $table.innerHTML="";
  db.transaction((con) => {
    con.executeSql("SELECT * FROM USER", [], (con, result) => {
      for (let i = 0; i < result.rows.length; i++) {
        $table.innerHTML += `
        <tr>
            <td>${result.rows[i].id}</td>
            <td>${result.rows[i].nombre}</td>
            <td>${result.rows[i].apellido}</td>
            <td>${result.rows[i].edad}</td>
            <td><buttom onclick=Editar('${result.rows[i].id}') type='button' class='btn btn-success'><i class='fas fa-edit'></i></buttom> | <buttom type='button' onclick=Eliminar('${result.rows[i].id}')  class='btn btn-danger'><i class=' fas fa-trash-alt'></i></buttom></td>
        </tr>
        
        `;

      }
    });
  });
};
document.addEventListener("DOMContentLoaded", Listado);

const Eliminar = (codigo) => {

  db.transaction((con) => {
    con.executeSql(
      "DELETE FROM USER WHERE id=?", [codigo]);

  });
  Listado();
}

const Editar = (codigo) => {
  let id = document.getElementById("codigo");
  let nombre = document.getElementById("nombre");
  let apellido = document.getElementById("apellido");
  let edad = document.getElementById("edad");
  
  id.value = codigo

  db.transaction((con) => {
    con.executeSql(
      "SELECT * FROM USER WHERE id=?", [codigo], (con, result) => {
        let rows = result.rows[0]

        id.value = rows.id;
        nombre.value = rows.nombre;
        apellido.value = rows.apellido;
        edad.value = rows.edad;
      });
  });
  btnupdate.style.visibility = "visible";
  $submit.style.visibility="hidden";
}

const Modifikasi = () => {
  
  let id = document.getElementById("codigo").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;
  console.log(id);
  db.transaction((con) => {
    if(id){
      con.executeSql(
        "UPDATE USER SET NOMBRE=?,APELLIDO=?,EDAD=? WHERE ID=?",
        [nombre, apellido, edad, id]
      
      );

    }
    
  });
  Listado();
  btnupdate.style.visibility = "hidden";
  $submit.style.visibility="visible";
  $Form.reset();
}
const Update = (document.getElementById("update").onclick = Modifikasi);


/*------ ----- Tombol submit ----- ------*/
$Form.addEventListener("submit", (e) => {
  Guardar();
  $Form.reset();
  e.preventDefault();
});

function exportPdf() {
  html2canvas(document.getElementById('tableBarang'), {
      onrendered: function (canvas) {
          var data = canvas.toDataURL();
          var docDefinition = {
              content: [{
                  image: data,
                  width: 500
              }]
          };
          pdfMake.createPdf(docDefinition).download("Table.pdf");
      }
  });
}

function exportExcel(tableID, filename = ''){
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById("tableBarang");
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = filename?filename+'.xls':'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}
