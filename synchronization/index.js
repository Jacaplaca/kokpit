const db = require("../models/index");
const Kontrahenci = db.kontrahenci_intf;
const Klienci = db.planer_klienci;
const User = db.users;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const to = require("await-to-js").default;

const idClient = 2;

const synch = async () => {
  const [klErr, klienci] = await to(
    Klienci.findAll({
      where: { clientId: idClient },
      raw: true
    })
  );
  const kl_ids = klienci.map(x => x.kh_id);
  // console.log("kl_ids", kl_ids);

  const [coErr, contractors] = await to(
    Kontrahenci.findAll({
      where: {
        client_id: idClient
        // id: { [Op.not]: kl_ids }
      },
      raw: true
    })
  );
  // console.log(contractors, coErr);
  const co_ids = contractors.map(x => x.id);

  for (let kh_id of kl_ids) {
    // console.log(kh_id);
    // // console.log(name, kh_id);
    kh_id = parseInt(kh_id, 10);

    if (co_ids.includes(kh_id)) {
      // console.log(contractors[klient.kh_id].symbol, klient.name, klient.kh_id);
      const oldName = klienci.filter(x => x.kh_id == kh_id)[0].name;
      const id = klienci.filter(x => x.kh_id == kh_id)[0].id;
      const newName = contractors.filter(x => x.id == kh_id)[0].symbol;

      const oldAdr = klienci.filter(x => x.kh_id == kh_id)[0].adr_Miejscowosc;
      const newAdr = contractors.filter(x => x.id == kh_id)[0].miejscowosc;

      const oldKod = klienci.filter(x => x.kh_id == kh_id)[0].adr_Kod;
      const newKod = contractors.filter(x => x.id == kh_id)[0].kod;
      // console.log(name == contr);
      if (oldName !== newName || oldAdr !== newAdr || oldKod !== newKod) {
        console.log("inne", oldName, newName, oldAdr, newAdr, oldKod, newKod);
        const [errClient, klient] = await to(
          Klienci.update(
            { name: newName, adr_Kod: newKod, adr_Miejscowosc: newAdr },
            {
              where: { id }
            }
          )
        );
      }
    }
  }
  const [ncErr, newContractors] = await to(
    Kontrahenci.findAll({
      where: {
        client_id: idClient,
        id: { [Op.not]: kl_ids }
      },
      raw: true
    })
  );

  console.log("newContractors", newContractors, newContractors.length);

  for (let contractor of newContractors) {
    const [createErr, create] = await to(
      Klienci.create({
        name: contractor.symbol,
        adr_Kod: contractor.kod,
        adr_Miejscowosc: contractor.miejscowosc,
        kh_id: contractor.id,
        clientId: idClient
      })
    );
    console.log(create);
  }

  // console.log(
  //   kh_id,
  //   contractors[kh_id] ? contractors[kh_id].id : "brak",
  //   contractors[kh_id] ? contractors[kh_id].symbol : "brak"
  //   // name
  // );
};

synch();
console.log("jestem w index syn");
