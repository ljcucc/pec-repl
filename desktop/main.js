// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, TouchBar, ipcMain} = require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarGroup} = TouchBar
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const isMac = process.platform === 'darwin'
let mainWindow, sender;

function TouchBarSetup(){
  let spinning = false

  // Reel labels
  const reel1 = new TouchBarLabel()
  const reel2 = new TouchBarLabel()
  const reel3 = new TouchBarLabel()

  // Spin result label
  const result = new TouchBarLabel()

  // Spin button
  // const spin = new TouchBarButton({
  //   label: '🎰 Spin',
  //   backgroundColor: '#7851A9',
  //   click: () => {
  //     // Ignore clicks if already spinning
  //     if (spinning) {
  //       return
  //     }

  //     spinning = true
  //     result.label = ''

  //     let timeout = 10
  //     const spinLength = 4 * 1000 // 4 seconds
  //     const startTime = Date.now()

  //     const spinReels = () => {
  //       updateReels()

  //       if ((Date.now() - startTime) >= spinLength) {
  //         finishSpin()
  //       } else {
  //         // Slow down a bit on each spin
  //         timeout *= 1.1
  //         setTimeout(spinReels, timeout)
  //       }
  //     }

  //     spinReels()
  //   }
  // })

  const getRandomValue = () => {
    const values = ['🍒', '💎', '7️⃣', '🍊', '🔔', '⭐', '🍇', '🍀']
    return values[Math.floor(Math.random() * values.length)]
  }

  // const updateReels = () => {
  //   reel1.label = getRandomValue()
  //   reel2.label = getRandomValue()
  //   reel3.label = getRandomValue()
  // }

  // const finishSpin = () => {
  //   const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size
  //   if (uniqueValues === 1) {
  //     // All 3 values are the same
  //     result.label = '💰 Jackpot!'
  //     result.textColor = '#FDFF00'
  //   } else if (uniqueValues === 2) {
  //     // 2 values are the same
  //     result.label = '😍 Winner!'
  //     result.textColor = '#FDFF00'
  //   } else {
  //     // No values are the same
  //     result.label = '🙁 Spin Again'
  //     result.textColor = null
  //   }
  //   spinning = false
  // }

  const touchBar = new TouchBar({
    items: [
      // spin,
      // new TouchBarSpacer({ size: 'large' }),
      // reel1,
      // new TouchBarSpacer({ size: 'small' }),
      // reel2,
      // new TouchBarSpacer({ size: 'small' }),
      // reel3,
      // new TouchBarSpacer({ size: 'large' }),
      // result
      // new TouchBarButton({
      //   icon:"./apps.png",
      //   click:()=>{

      //   }
      // }),
      new TouchBarButton({
        icon:"./code.png",
        click:()=>{
          if(sender)
            sender.send("code-editor-toggle");
        }
      })
    ]
  })

  mainWindow.setTouchBar(touchBar)
}

function setupMenu(){
  const menu = Menu.buildFromTemplate([
    // { role: 'appMenu' }
    ...(isMac ? [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { role: 'quit' }
      ]
    },
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/ljcucc/power-editing')
          }
        },
        { role: 'toggledevtools' }
      ]
    }] : [])
  ])
  if(isMac) Menu.setApplicationMenu(menu)
  else Menu.setApplicationMenu(null)
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:700,
    minHeight:300,
    nodeIntegration: true,
    // nodeIntegrationInWorker: true,
    // enableRemoteModule:true,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('public/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit()
  });

  mainWindow.show();

  setupMenu();
  if(isMac) TouchBarSetup();
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on("ok", (e,a)=>{
  sender = e.sender;
})