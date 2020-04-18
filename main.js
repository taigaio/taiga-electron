const {app, protocol, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function interceptUrls(request, callback) {
    console.log(request.url);
    if (request.url == "file:///conf.json") {
      callback(path.join(__dirname, "conf.json"));
    } else if (request.url.startsWith("file:///plugins/")) {
      console.log(path.join(__dirname, request.url.substring(5)));
      callback(path.join(__dirname, request.url.substring(5)));
    } else if (fs.existsSync(path.join(__dirname, "taiga-front-dist", "dist", request.url.substring(5)))) {
      callback(path.join(__dirname, "taiga-front-dist", "dist", request.url.substring(5)));
    } else {
      callback(path.join(__dirname, "taiga-front-dist", "dist", "index.html"));
    }
}

function createWindow () {
  protocol.interceptFileProtocol("file", interceptUrls)

  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, 'webPreferences': {'nodeIntegration': false}})

  // Open the DevTools.
  win.webContents.openDevTools()

  // and load the index.html of the app.
  root_url = url.format({
    pathname: "/login",
    protocol: 'file:',
    slashes: true
  })
  win.loadURL(root_url)
  // win.loadURL("https://tree.taiga.io")

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Disable Menus also in new windows
app.on('browser-window-created',function(e,window) {
       window.setMenu(null);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
