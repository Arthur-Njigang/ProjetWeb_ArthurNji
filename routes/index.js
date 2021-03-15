const express = require('express');
const router = new express.Router();
const fs = require('fs');
const path = require('path');

// console.log(student);

/* GET home page. */
router.get('/', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'resto.json'));
  let resto = JSON.parse(rawdata);
  res.render('index', { title: 'Accueil', restos:resto });
});

/* GET cmd infos */
router.get('/cmd-details', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  var cmdnow = session_data.cmds;
  var lastcmd = JSON.parse(cmdnow);
  lastcmd = lastcmd[lastcmd.length-1]
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'resto.json'));
  let resto = JSON.parse(rawdata);
  res.render('cmd-details', { title: 'Détails commande', cmd:lastcmd, restos:resto  });
});

/* GET Dashboard resto */
router.get('/resto-dashboard', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  var currentdate = new Date(); 
  var createdat = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  if (session_data.cmds == undefined) {
    var lastcmd = [];
    var stat1 = 0;
    var stat2 = 0;
    var stat3 = 0;
    var stat4 = 0;
    var stat5 = 0;
  } else {
    var cmdnow = session_data.cmds;
    var lastcmd = JSON.parse(cmdnow);
    var stat1 = lastcmd.filter( champ => champ.status == "En cours" && champ.resto == session_data.user_info).reduce((accum,item) => accum + parseInt(item.nbre_repas), 0);
    var stat2 = lastcmd.filter( champ => champ.resto == session_data.user_info && champ.status == "Prêt" ).length;
    var stat3 = lastcmd.filter( champ => champ.resto == session_data.user_info && champ.status == "Enlevé" ).length;
    var stat4 = createdat;
    var stat5 = createdat;
    lastcmd = lastcmd.filter( champ => champ.resto == session_data.user_info && champ.status == "En cours" )
  }
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'resto.json'));
  let resto = JSON.parse(rawdata);
  res.render('resto-dashboard', { title: 'Dashboard resto', cmds:lastcmd.reverse(), user:session_data.user_info, stat1:stat1, stat2:stat2, stat3:stat3, stat4:stat4, stat5:stat5, restos:resto });
});

/* GET Dashboard Admin */
router.get('/admin-dashboard', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  var currentdate = new Date(); 
  var createdat = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  if (session_data.cmds == undefined) {
    var lastcmd = [];
    var stat1 = 0;
    var stat2 = 0;
    var stat3 = 0;
    var stat4 = 0;
    var stat5 = 0;
  } else {
    var cmdnow = session_data.cmds;
    var lastcmd = JSON.parse(cmdnow);
    var stat1 = lastcmd.filter( champ => champ.status == "En cours" ).reduce((accum,item) => accum + parseInt(item.nbre_repas), 0);
    var stat2 = lastcmd.filter( champ => champ.status == "Prêt" ).length;
    var stat3 = lastcmd.filter( champ => champ.status == "Enlevé" ).length;
    var stat4 = lastcmd.filter( champ => champ.status == "Livré" ).length;
    var stat5 = createdat;
    lastcmd = lastcmd.filter( champ => champ.status != "Annulé" )
  }
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'resto.json'));
  let resto = JSON.parse(rawdata);
  res.render('admin-dashboard', { title: 'Dashboard Admin', cmds:lastcmd.reverse(), user:session_data.user_info, stat1:stat1, stat2:stat2, stat3:stat3, stat4:stat4, stat5:stat5, restos:resto });
});


router.get('/update-cmd-admin', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  if (session_data.cmds == undefined) {
    var lastcmd = [];
  } else {
    var cmdnow = session_data.cmds;
    var lastcmd = JSON.parse(cmdnow);
    lastcmd = lastcmd.filter( champ => champ.status == "En cours" )
  }
  return res.status(200).json({ type:"success", message: "Commande recupérée avec succès !", data:lastcmd.reverse() });
});

router.get('/update-cmd', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  if (session_data.cmds == undefined) {
    var lastcmd = [];
  } else {
    var cmdnow = session_data.cmds;
    var lastcmd = JSON.parse(cmdnow);
    lastcmd = lastcmd.filter( champ => champ.resto == session_data.user_info && champ.status == "En cours" )
  }
  return res.status(200).json({ type:"success", message: "Commande recupérée avec succès !", data:lastcmd.reverse() });
});

router.get('/dashboard/cmd-ready/:id', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  var currentdate = new Date(); 
  var createdat = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  var cmdnow = session_data.cmds;
  var lastcmd = JSON.parse(cmdnow);
  function update(id_cmd, prop, val) {
    var person = lastcmd.find(function(p) {
      return p.id_cmd === id_cmd;
    });
    
    if (person && person[prop]) {
      person[prop] = val;
    }
  }
  update(req.params.id, 'status', 'Prête');
  update(req.params.id, 'preparedat', createdat);
  req.session.save(function(err) {
    res.redirect('/resto-dashboard');
  })
  // return res.status(200).json({ type:"success", message: "Commande recupérée avec succès !", data:lastcmd.reverse() });
});

router.get('/cancel-cmd/:id', (req, res, next) => {
  var session_data = req.session;
  console.log(session_data.cmds);
  var currentdate = new Date(); 
  var createdat = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  var cmdnow = session_data.cmds;
  var lastcmd = JSON.parse(cmdnow);
  function update(id_cmd, prop, val) {
    var person = lastcmd.find(function(p) {
      return p.id_cmd === id_cmd;
    });
    
    if (person && person[prop]) {
      person[prop] = val;
    }
  }
  update(req.params.id, 'status', 'Annulé');
  update(req.params.id, 'preparedat', createdat);
  req.session.save(function(err) {
    res.redirect('/admin-dashboard');
  })
  // return res.status(200).json({ type:"success", message: "Commande recupérée avec succès !", data:lastcmd.reverse() });
});

router.get('/delete-cmd/', (req, res, next) => {
  var session_data = req.session;
  session_data.cmds = [];
  req.session.save(function(err) {
    res.redirect('/admin-dashboard');
  })
  // return res.status(200).json({ type:"success", message: "Commande recupérée avec succès !", data:lastcmd.reverse() });
});

/* ---------- POST ROUTES ----------- */

router.post('/store-cmd', (req, res, next) => {
  var currentdate = new Date(); 
  var createdat = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  var session_data = req.session;
  if (session_data.cmds == undefined) {
    var cmd = [{
        nom: req.body.nom,
        nbre_repas: req.body.nbre_repas,
        rue: req.body.rue,
        numero_maison: req.body.numero_maison,
        numero_boite: req.body.numero_boite,
        code_postal: req.body.code_postal,
        commune: req.body.commune,
        resto: req.body.resto,
        id_cmd: req.body.id_cmd,
        createdat: createdat,
        preparedat:"",
        status: "En cours"
    }];
    session_data.cmds = JSON.stringify(cmd);
  }else{
      var newcmd = JSON.parse(session_data.cmds);
      var cmd = {
        nom: req.body.nom,
        nbre_repas: req.body.nbre_repas,
        rue: req.body.rue,
        numero_maison: req.body.numero_maison,
        numero_boite: req.body.numero_boite,
        code_postal: req.body.code_postal,
        commune: req.body.commune,
        resto: req.body.resto,
        id_cmd: req.body.id_cmd,
        createdat: createdat,
        preparedat:"",
        status: "En cours"
      };
      newcmd.push(cmd);
      session_data.cmds = JSON.stringify(newcmd);
  }
  req.session.save(function(err) {
    // console.log(session_data.cmds);
    if(err) return res.status(200).json({ type:"error", message: err });
    return res.status(200).json({ type:"success", message: "Commande enregistrée avec succès !" });
  })
});

router.post('/login', (req, res, next) => {
  var session_data = req.session;
  session_data.user_info = req.body.resto;
  session_data.type_user = req.body.typeuser;
  req.session.save(function(err) {
    if(err) return res.status(200).json({ type:"error", message: err });
    return res.status(200).json({ type:"success", message: "Bienvenue "+req.body.resto+" !", data:req.body.typeuser });
  })
});

module.exports = router;
