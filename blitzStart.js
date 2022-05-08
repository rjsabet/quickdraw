const {app, Menu, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

/* Clear session on closing  */
const { Connection, Request } = require("tedious"); //Cloud
var sqlite3 = require('sqlite3').verbose(); //Local


/* Set Up Menu  profiles*/ 
const isMac = process.platform === 'darwin'
const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {role: 'about'},
            {role: 'quit'},
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },   
        ]
        

        
    }] : [])
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);

function createWindow(){
    //Creates the Window
    win = new BrowserWindow({width:1280, height:800, icon: '', autoHideMenuBar: true ,webPreferences: {nodeIntegration: true,  contextIsolation: false, devTools: false}});
    win.resizable = false;
    //win.minimizable = false;
    win.maximizable = false;
    //win.setMenuBarVisibility(false);
 
    
    
    //Load index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'blitzcron_main.html'),
        protocol: 'file',
        icon: 'Quikdraw_logo.png',
        slashes: true
    }));

    win.on('closed', () => {

      //Instantiate connection for local and cloud db

      /* Cloud */
      const config = {
        authentication: {
          options: {
            userName: "", // insert .env string
            password: "" // insert .env string
          },
          type: "default"
        },
        server: "raiserver.database.windows.net", // insert .env string
        options: {
          database: "mimik_licenseKeys", // insert .env string
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
        }
      }); 
      
      
      connection.connect();

      /* Local */
      var save_db = process.resourcesPath +'/bauto.Data/databaseMold/savekey.db';
      let save = new sqlite3.Database(`${save_db}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Serpent Actions Initiated!')
      });


      //Execute authentication and exiting the session
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
    
         connection.execSql(request);
         connection.close();
      });
        
    });
}

//Runs the createWindow function
app.on('ready', createWindow);

//Gets Icon
app.getFileIcon('serpenticon.jpg')


//Quit when all windows are closed - Also check to see if you're NOT on a MAC OS. MAC = darwin, Windows = win32
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.exit();
    }
    
    
});
