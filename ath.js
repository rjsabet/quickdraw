const { Connection, Request } = require("tedious"); //Cloud
var sqlite3 = require('sqlite3').verbose(); //Local

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
/* For key handling */
var save_db = process.resourcesPath + '/bauto.Data/databaseMold/savekey.db';
let save = new sqlite3.Database(`${save_db}`, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Serpent Actions Initiated!')
});

const config = {
  authentication: {
    options: {
      userName: "", // object needs to be pulled from env
      password: "" // object needs to be pulled from env
    },
    type: "default"
  },
  server: "raiserver.database.windows.net", // object needs to be pulled from env
  options: {
    database: "", //object needs to be pulled from env
    encrypt: true
  }
};

const connection = new Connection(config);

connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    //authEntry();
    //motd_message();
    console.log('works')
  }
}); 


connection.connect();

function authEntry(){

  //Establish Connection
  
  let license_Keys = document.querySelector('.Rectangle_1').value;
  const sql = `SELECT licenseKey FROM [customerRealm_1] WHERE licenseKey = '${license_Keys}'`;

  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.log('error occured!');
      throw err;
    }

    console.log('Button Clicked');
    
//Create an update database function for housing the used license key. 
//Then create an invicible label that displays the license key, so that when the user exits, you can use that label to verify the used license key to end that users session

  });
  
  //Emit Returned Value
  request.on("row", columns1 => { columns1.forEach(customerLicense => { console.log(customerLicense.value); 
  
    if(customerLicense.value == license_Keys)
    {

      request.on('requestCompleted', function () {
        // Next SQL statement.
        save.run('UPDATE l_key SET keys = ? WHERE k_id = 1', [license_Keys], function(err){
            if(err){
                return console.error(err.message);
            }
        });
        checkSesh();
        //motd_message();
      });

    } else {
      //connection.close()
      //document.querySelector('#responseMat').style.display = 'block';
      document.querySelector('#responseMat').innerHTML = 'Invalid Code, Try Again';
      sleep(3000);
      location.reload();
    } }); });
  
  
  


    
    


  connection.execSql(request);
  //connection.close();
}

function checkSesh(){
  let license_Keys = document.querySelector('.Rectangle_1').value;
  const sql = `SELECT activeStatus FROM [customerRealm_1] WHERE licenseKey = '${license_Keys}'`;

  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.log('error occured!');
      throw err;
    }
    
    //console.log(`retrieved ${license_Keys}'s' license key!`)
    //connection.close();
    

  });

  //Emit Returned Value
  request.on("row", columns2 => { columns2.forEach(sesh => { console.log(sesh.value);
    
    if(sesh.value != true)
    {
      //document.querySelector('#auth_button').style.display = 'none';
      //document.querySelector('#buttontext').textContent = '';
      //document.querySelector('.statusMes').textContent = 'You are now signed in';
      //document.querySelector('#auth_entry').style.display = 'none';
      //document.querySelector('#buyerlink').style.display = 'none';
      window.location.href = './blitzcron_main.html';
      //document.querySelector('#code_hyperlink').textContent = '';
      //document.querySelector('#code_buy').textContent = '';
      //document.querySelector('#destroy_button').style.display = 'block';
      request.on('requestCompleted', function () {
        createSesh();
        //motd_message();
      });

    } else {
      //document.querySelector('#responseMat').style.display = 'block';
      document.querySelector('#responseMat').textContent = 'This code is already in use, elsewhere.';
    } });});
    

   connection.execSql(request);
}



function createSesh(){
  let license_Keys = document.querySelector('.Rectangle_1').value;
  const sql = `UPDATE [customerRealm_1] SET activeStatus = 'True' WHERE [licenseKey] = '${license_Keys}'`;

  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.log('error occured!');
      throw err;
    }
    //console.log(`retrieved ${license_Keys}'s' license key!`)
    //connection.close();
    

  });

  //Emit Returned Value
  request.on("row", columns2 => { columns2.forEach(createS => { createS.value;
    
    if(createS.value == true)
    {
      console.log('Session Created');
      
    } else {

    }
    
  });});

   connection.execSql(request);
   connection.close();
}

function endSesh(){
    save.each('SELECT keys FROM l_key WHERE k_id = 1', function(err, row){
        if(err){
            return console.error(err.message);
        }
        /* GET ENTERED KEY */
        
        var key_in_sesh = row.keys;
        console.log(key_in_sesh);
        const sql = `UPDATE [customerRealm_1] SET activeStatus = 'False' WHERE [licenseKey] = '${key_in_sesh}'`;
  
        const request = new Request(sql, (err, rowCount) => {
          if (err) {
            console.log('error occured!');
            throw err;
          }

          //console.log(`listening`)
          //connection.close();
          //window.location.reload();
          save.run('UPDATE l_key SET keys = 0 WHERE k_id = 1', function(err){
            if(err){
                return console.error(err.message);
            }
            console.log('done')
            
          });
      
        });
    
        //Emit Returned Value
        //request.on("row", columns2 => { columns2.forEach(destroyS => { destroyS.value;
        //
        //  if(destroyS.value == false)
        //  {//Reload page after destroyed
        //    window.location.href = './serpentAuth';
        //
        //  }
        //});});
    
         connection.execSql(request);
         connection.close();
    });
}

function destroySesh(){
    let license_Keys = document.querySelector('.Rectangle_1').value;
    const sql = `UPDATE [customerRealm_1] SET activeStatus = 'False' WHERE [licenseKey] = '${license_Keys}'`;
  
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.log('error occured!');
        throw err;
      }
      
      //console.log(`retrieved ${license_Keys}'s' license key!`)
      //connection.close();
      window.location.reload();
  
    });
  
    //Emit Returned Value
    request.on("row", columns2 => { columns2.forEach(destroyS => { destroyS.value;
      
      if(destroyS.value == false)
      {//Reload page after destroyed

        window.location.href = './blitzcron_login.html';
  
      }
      
    });});
  
     connection.execSql(request);
  
  
  }
