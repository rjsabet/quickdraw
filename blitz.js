var sqlite3 = require('sqlite3').verbose();
const Puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
Puppeteer.use(StealthPlugin());

//Bot Methods and Non Bot Methods
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* @Routes for DB paths */
var db_path = (process.resourcesPath + '/bauto.Data/databaseMold/blitz.db');
var pc_path = (process.resourcesPath + '/bauto.Data/databaseMold/profC.db'); 


function onBoot(){ /* This will emit all data cells on table and profile count */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    let pc = new sqlite3.Database(`${pc_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Established Calculations')
    });

    db.serialize(() => {
        db.each(`SELECT * FROM profs`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            

            var rHandler = row.handler;
            var rSetup = row.profileName;
            var rProxy = row.proxy;
            var rURL = row.urlLink;
            var rMeth = row.method;
            
            const hlr = [rHandler];
            const setup = [rSetup];
            const prox = [rProxy];
            const url = [rURL];
            const uMethod = [rMeth];
            
            
            hlr.forEach(function(handle, index){
                const hlr_setup = setup[index];
                const hlr_prox = prox[index];
                const hlr_url = url[index];
                const hlr_method = uMethod[index];
                let tblHtml = `<tr>`+`<div class="tbl_index${handle}"><div><span class="increment_check_">${handle}</span></div>`+`<td><div class="indexName${handle}"><span class="iName${handle}">${hlr_setup}</span></div></td>`+`<td><div class="urlString${handle}"><span class="urString${handle}">${hlr_url}</span></div></td>`+`<td><div class="proxyString${handle}"><span class="prxString${handle}">${hlr_prox}</span></div></td>`+`<td><div class="delPrf_btn${handle}"><span class="delBtn${handle}" style="cursor: pointer;" onclick="deletePrf(this.className)">Delete Profile</span></div></td>`+`<td><div class="editPrf_btn${handle}"><span class="edBtn${handle}" style="cursor: pointer;" onclick="editPrf(this.className)">Edit Profile</span></div></td>`+`<td><div class="editPrf_btn_u${handle}">`+`<span class="rnBtn${handle}" style="cursor: pointer;" onclick="blitz(this.className)">Run Profile</span></div></td>`+`<td><div class="proxyString_v${handle}"><span class="usr_meth${handle}">${hlr_method}</span></div></td>`+`</div>`+`</tr>`;
                let block = document.getElementById('wholeTable').getElementsByClassName('tableBod')[0];
                //New Row
                var newRow = block.insertRow(block.rows.length);
                newRow.innerHTML = tblHtml;
            });


        });
    });

    pc.serialize(() => {
        pc.each(`SELECT profileNum FROM counts`, (err, row) => {
            if (err) {
                console.error(err.message);
            }

            document.querySelector('#pf_count').innerHTML = row.profileNum;


        });
    });
    
    if (document.querySelector('#pf_count').innerHTML = 'NULL'){
        document.querySelector('#pf_count').innerHTML = 0;
    };
    
    
}

async function blitz(clicked_className){ /* This will run the browser control and whether or not the task will be automated or manual*/
    // Add executablePath: `${chromiumPath}`, when development phase is completed
    // Add `${profilePath}/snkrs3` as userDataDir when development phase is completed

    var convertChar = String(clicked_className);//Converts into a string to be filtered
    convertChar = convertChar.replace(/[^0-9]/g, "");//Filters strings for numbers
    console.log(convertChar);
    /* Database Stuff */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    /** Needed Variables */                 
    //var proChecker = document.querySelector('.increment_check_').innerHTML; /** Integer that helps the system differentiate the data */
    //let chromiumPath = (process.resourcesPath +'/node_modules/puppeteer/.local-chromium/mac-938248/chrome-mac/Chromium.app/Contents/MacOS/Chromium') /* Make sure to set the paths for both window/mac chromium routes */
    //let profilePath = (process.resourcesPath +'/profiles');

    db.each(`SELECT * FROM profs WHERE handler = ?`, convertChar, async function(err, row) {
        if (err) {
            console.error(err.message);
        }

        /** Differential Variables */
        //var this_method = row.method;
        var this_proxy = row.proxy;
        var this_url = row.urlLink;
        
        /** Method Logic */
        let chromiumPath = (process.resourcesPath +'/node_modules/puppeteer/.local-chromium/mac-950341/chrome-mac/Chromium.app/Contents/MacOS/Chromium');
        let chromiumWin = (process.resourcesPath +'/node_modules/puppeteer/.local-chromium/win64-950341/chrome-win/chrome.exe');
        let profilePath = (process.resourcesPath +'/bauto.Data/profileData/usrPro');                                                     
        const browser = await Puppeteer.launch({headless: false, executablePath: `${chromiumWin}`, userDataDir: `${profilePath}${convertChar}`, args: ['--app=https://www.blitzcron.com/', `--proxy-server=${this_proxy}`]}); //Be sure to add userDataDir: '' to the launch parameters
        const [page] = await browser.pages();
        await page.goto(this_url);
        
    });


}

async function signinEdit(){/** May need the addPrf function to show the POTENTIAL handlerID so that the profile folder number can include the handlerID at then end of it's path */
    let chromiumPath = (process.resourcesPath +'/node_modules/puppeteer/.local-chromium/mac-938248/chrome-mac/Chromium.app/Contents/MacOS/Chromium');
    let chromiumWin = (process.resourcesPath +'/node_modules/puppeteer/.local-chromium/win64-950341/chrome-win/chrome.exe');
    let profilePath = (process.resourcesPath +'/bauto.Data/profileData/usrPro');
    var proChecker = document.querySelector('#inc_check').innerHTML;
    var url = document.querySelector('.url_string_be').value;
    const browser = await Puppeteer.launch({headless: false, executablePath: `${chromiumWin}`, userDataDir: `${profilePath}${proChecker}`, args: ['--app=https://www.google.com/']}); //Be sure to add userDataDir: '' to the launch parameters
    const [page] = await browser.pages();
    await page.goto(url); 
}
//END 

// Database Stuff && UX
function addPrf(){
    document.querySelector('#add_popup').style.display = 'block';
    var pfNum = parseInt(document.querySelector('#pf_count').innerHTML);
    document.querySelector('#pf_count').innerHTML = pfNum += 1;
    console.log(pfNum);

    /* Dropdown box */
    //var addMethod = document.querySelector('.task_dropbox');
    //var methSelect = ['Man.'];
    ////Dropdown Logic
    //for(var i = 0; i < methSelect.length; i++){
    //    var methAd = methSelect[i];
    //    var methStl = document.createElement('option');
    //    methStl.textContent = methAd;
    //    methStl.value = methAd;
    //    addMethod.appendChild(methStl);
    //}

    let jut = document.querySelector('.task_dropbox').value;
    document.querySelector('.task_dropbox').value = 'Man';
    console.log(jut)
    /* Fix Profile Read Bug 1 - Stop incrementing multiple profiles */
    if (document.querySelector('#add_popup').style.display = 'block')
        document.querySelector('#addP').style.display = 'none';
    
    
}

function saveAdd(){
    /* Database Stuff */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    let pc = new sqlite3.Database(`${pc_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Established Calculations')
    });


    let proNum = parseInt(document.querySelector('#pf_count').innerHTML);
    let indexName = document.querySelector('.index_name').value;
    let url_str = document.querySelector('.url_string').value;
    let proxy_str = document.querySelector('.proxy_string').value;
    let meth_slt = document.querySelector('.task_dropbox').value;
    
    db.serialize(() => {
        db.run(`INSERT INTO profs(profileName, proxy, urlLink, method) VALUES(?,?,?,?)`, [indexName, proxy_str, url_str, meth_slt], function(err) {
            if (err) {
                return console.error(err.message);
            }
     
            //console.log(`Handler ${handler} has been created`);
     
        });
    });


    /* Profile Count Update */
    pc.run(`UPDATE counts SET profileNum = ? WHERE count_id = 1`, proNum, function(err){
        if (err) {
            return console.error(err.message);
        }
    });

    document.querySelector('#add_popup').style.display = 'none';
    document.location.reload(true);

}

function cancelAdd(){
    document.querySelector('#add_popup').style.display = 'none';
    document.querySelector('#addP').style.display = 'block';

    var pfNum = parseInt(document.querySelector('#pf_count').innerHTML);
    pfNum -= 1;
    document.querySelector('#pf_count').innerHTML = pfNum;
    console.log(pfNum);

}

function editPrf(clicked_className){
    document.querySelector('#edit_popup').style.display = 'block';
    document.querySelector('#addP').style.display = 'none';

    // Need to create a method where if the last character is greater than 9, then the classN.length # should be two and if it's greater than 99, then the classN.length # should be 3 etc etc.
    var convertChar = String(clicked_className);//Converts into a string to be filtered
    convertChar = convertChar.replace(/[^0-9]/g, "");//Filters strings for numbers
    console.log(convertChar);
    /* Fix Profile Read Bug 1 - Stop incrementing multiple profiles */

    /* Dropdown box */
    //var addMethod = document.querySelector('.task_dropbox_bg');
    //var methSelect = ['Man.'];
    ////Dropdown Logic
    //for(var i = 0; i < methSelect.length; i++){
    //    var methAd = methSelect[i];
    //    var methStl = document.createElement('option');
    //    methStl.textContent = methAd;
    //    methStl.value = methAd;
    //    addMethod.appendChild(methStl);
    //}

    /* Database Stuff */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });


    db.each(`SELECT * FROM profs WHERE handler = ?`, convertChar, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        //document.querySelector('#inc_check').innerHTML = row.handler
        document.querySelector('.index_name_bd').value = row.profileName;
        document.querySelector('.url_string_be').value = row.urlLink;
        document.querySelector('.proxy_string_bf').value = row.proxy;
        document.querySelector('.task_dropbox_bg').currentValue = row.method;
        var hdlr = row.handler;
        if (hdlr.length > 1) {
            clLength = 2;
        }
        //console.log(lastchar + " " + hdlr);
    });

    document.querySelector('#inc_check').innerHTML = convertChar;
    

}

function saveEdit(){
    /* Database Stuff */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    /*  */

   var idHandler = document.querySelector('#inc_check').innerHTML; /* Was instantiated in the open_edit() function. Also, opacity was dropped to 0 in the serpentBot.css Ln 51. */
   var sql = `UPDATE profs SET profileName = ?, proxy = ?, urlLink = ?, method = ? WHERE handler = ${idHandler}`;

   let indexName = document.querySelector('.index_name_bd').value;
   let url_str = document.querySelector('.url_string_be').value;
   let proxy_str = document.querySelector('.proxy_string_bf').value;
   let meth_slt = document.querySelector('.task_dropbox_bg').value;
   
   var userData = [indexName, proxy_str, url_str, meth_slt];
   
    
   db.run(sql, userData, function(err) {
    if (err) {
        return console.error(err.message);
    }

   });

   document.querySelector('#edit_popup').style.display = 'none';
   document.querySelector('#addP').style.display = 'block';
   document.location.reload(true);
}

function cancelEdit(){
    document.querySelector('#edit_popup').style.display = 'none';
    document.querySelector('#addP').style.display = 'block';
}

function deletePrf(clicked_className){
    var pfNum = parseInt(document.querySelector('#prf_count').textContent);
    
    var convertChar = String(clicked_className);//Converts into a string to be filtered
    convertChar = convertChar.replace(/[^0-9]/g, "");//Filters strings for numbers
    console.log(convertChar);

    /* Subtract from profile count and emit changes */
    pfNum -= 1;
    document.querySelector('#pf_count').innerHTML = pfNum;
    console.log(pfNum);

    /* Database Stuff */
    let db = new sqlite3.Database(`${db_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    let pc = new sqlite3.Database(`${pc_path}`, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connection established')
    });

    db.run(`DELETE FROM profs WHERE handler = ?`, convertChar, function(err){
        if (err) {
            return console.error(err.message);
        }
    });

    /* Profile Count Update */
    pc.run(`UPDATE counts SET profileNum = ? WHERE count_id = 1`, pfNum, function(err){
        if (err) {
            return console.error(err.message);
        }
    });

    document.location.reload(true);


}
//END