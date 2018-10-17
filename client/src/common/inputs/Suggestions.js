import React from "react";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";

export const simpleSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div style={{ display: "block", width: "100%" }}>
        <span>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </span>
      </div>
      {/* <span>{gmina}</span> */}
    </MenuItem>
  );
};

export const clientSuggestion = (suggestion, { query, isHighlighted }) => {
  const { name, adr_Kod, adr_Miejscowosc } = suggestion;
  const matches = match(name, query);
  const parts = parse(name, matches);
  const matchesKod = match(adr_Kod, query);
  const partsKod = parse(adr_Kod, matchesKod);
  const matchesMiejscowosc = match(adr_Miejscowosc, query);
  const partsMiejscowosc = parse(adr_Miejscowosc, matchesMiejscowosc);

  return (
    <MenuItem selected={isHighlighted} component="div" dense>
      <div style={{ display: "block", width: "100%" }}>
        <span>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </span>
        <span style={{ float: "right" }}>
          <span style={{ fontSize: 15, marginRight: 5 }}>
            {partsKod.map((part, index) => {
              return part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              ) : (
                <strong key={String(index)} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>
              );
            })}
          </span>
          <span style={{ fontSize: 15 }}>
            {partsMiejscowosc.map((part, index) => {
              return part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              ) : (
                <strong key={String(index)} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>
              );
            })}
          </span>
        </span>
      </div>
    </MenuItem>
  );
};
