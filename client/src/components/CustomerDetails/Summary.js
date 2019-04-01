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
    {
      type: "Spt34",
      brand: "New Holland",
      otherBrand: "",
      howMany: "2",
      isOK: true
    },
    { type: "Fiko55", brand: "", otherBrand: "Other", howMany: 1, isOK: true },
    { type: "", brand: "", otherBrand: "", howMany: 1, isOK: false }
  ],
  harvester: [
    {
      type: "FarmerMax",
      brand: "Ursus",
      otherBrand: "",
      howMany: "1",
      isOK: true
    }
  ],
  cultivator: [
    {
      type: "Siewnik",
      brand: "",
      otherBrand: "Noname",
      howMany: 1,
      isOK: true
    },
    {
      type: "Kosiarka",
      brand: "",
      otherBrand: "",
      howMany: "2",
      isOK: false
    }
  ],
  agro: [
    { type: "", brand: "", otherBrand: "Pług", howMany: "2", isOK: true },
    {
      type: "",
      brand: "",
      otherBrand: "Snopowiązałka",
      howMany: "3",
      isOK: true
    },
    {
      type: "",
      brand: "",
      otherBrand: "Wóz drabiniasty",
      howMany: 0,
      isOK: false
    }
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
        <div style={{ ...style.content }}>{data.name}</div>
        <div style={{ ...style.label }}>Nazwisko:</div>
        <div style={{ ...style.content }}>{data.surname}</div>
        <div style={{ ...style.label }}>Adres:</div>
        <div style={{ ...style.content }}>{data.address}</div>
        <div style={{ ...style.label }}>Nr tel.:</div>
        <div style={{ ...style.content }}>{data.phone}</div>
        <div style={{ ...style.label }}>Ile hektarów pola:</div>
        <div style={{ ...style.content }}>{data.field} ha</div>
        <div style={{ ...style.label }}>Ile hektarów łąk:</div>
        <div style={{ ...style.content }}>{data.meadow} ha</div>
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
          {data.tractor &&
            data.tractor
              .filter(x => x.isOK)
              .map((x, i) => (
                <div key={i} style={{ ...style.content }}>
                  {x.brand === "" ? x.otherBrand : x.brand} - {x.type} -{" "}
                  {x.howMany} szt.
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
          {data.harvester &&
            data.harvester
              .filter(x => x.isOK)
              .map((x, i) => (
                <div key={i} style={{ ...style.content }}>
                  {x.brand === "" ? x.otherBrand : x.brand} - {x.type} -{" "}
                  {x.howMany} szt.
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
          {data.cultivator &&
            data.cultivator
              .filter(x => x.isOK)
              .map((x, i) => (
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
          {data.agro &&
            data.agro
              .filter(x => x.isOK)
              .map((x, i) => (
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
