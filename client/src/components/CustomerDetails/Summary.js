import React from "react";

const dataMock = {
  name: "Antonid",
  surname: "Tracz",
  address: "Wólka Brzostowiecka Stara",
  phone: "855 555 555",
  tractorBrand: "",
  field: "13",
  meadow: "43",
  tractor: [
    // { type: "Spt34", brand: "New Holland", otherBrand: "", howMany: "2" },
    // { type: "Fiko55", brand: "", otherBrand: "Other", howMany: 1 }
    { type: "", brand: "", otherBrand: "", howMany: 1 }
  ],
  harvester: [
    { type: "FarmerMax", brand: "Ursus", otherBrand: "", howMany: "1" }
  ],
  cultivator: [
    { type: "Siewnik", brand: "", otherBrand: "Noname", howMany: 1 },
    { type: "Kosiarka", brand: "", otherBrand: "Bizon", howMany: "2" }
  ],
  agro: [
    { type: "", brand: "", otherBrand: "Pług", howMany: "2" },
    { type: "", brand: "", otherBrand: "Snopowiązałka", howMany: "3" },
    { type: "", brand: "", otherBrand: "Wóz drabiniasty", howMany: 1 }
  ]
};

const style = {
  label: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 400,
    textAlign: "right",
    marginTop: 3,
    marginRight: 17
  },
  content: {
    // textTransform: "uppercase",
    fontSize: 14,
    fontWeight: 600
    // textAlign: "right",
    // marginTop: 3,
    // marginRight: 11
  }
};

const Summary = ({ data }) => {
  // console.log("data", JSON.stringify(data));
  return (
    <div>
      <div>asdfsadfsadf</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `210px 1fr`,
          marginBottom: 10
        }}
      >
        <div style={{ ...style.label }}>Imię:</div>
        <div style={{ ...style.content }}>{dataMock.name}</div>
        <div style={{ ...style.label }}>Nazwisko:</div>
        <div style={{ ...style.content }}>{dataMock.surname}</div>
        <div style={{ ...style.label }}>Adres:</div>
        <div style={{ ...style.content }}>{dataMock.address}</div>
        <div style={{ ...style.label }}>Nr tel.:</div>
        <div style={{ ...style.content }}>{dataMock.phone}</div>
        <div style={{ ...style.label }}>Ile hektarów pola:</div>
        <div style={{ ...style.content }}>{dataMock.field} ha</div>
        <div style={{ ...style.label }}>Ile hektarów łąk:</div>
        <div style={{ ...style.content }}>{dataMock.meadow} ha</div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `210px 1fr`,
          marginBottom: 10
        }}
      >
        <div style={{ ...style.label }}>Traktory:</div>
        <div>
          {dataMock.tractor.map((x, i) => (
            <div key={i} style={{ ...style.content }}>
              {x.brand === "" ? x.otherBrand : x.brand} - {x.type} - {x.howMany}{" "}
              szt.
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `210px 1fr`,
          marginBottom: 10
        }}
      >
        <div style={{ ...style.label }}>Kombajny:</div>
        <div>
          {dataMock.harvester.map((x, i) => (
            <div key={i} style={{ ...style.content }}>
              {x.brand === "" ? x.otherBrand : x.brand} - {x.type} - {x.howMany}{" "}
              szt.
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `210px 1fr`,
          marginBottom: 10
        }}
      >
        <div style={{ ...style.label }}>Maszyny siewne:</div>
        <div>
          {dataMock.cultivator.map((x, i) => (
            <div key={i} style={{ ...style.content }}>
              {x.otherBrand} - {x.type} - {x.howMany} szt.
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `210px 1fr`,
          marginBottom: 10
        }}
      >
        <div style={{ ...style.label }}>Inne maszyny rolnicze:</div>
        <div>
          {dataMock.agro.map((x, i) => (
            <div key={i} style={{ ...style.content }}>
              {x.otherBrand} - {x.howMany} szt.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
