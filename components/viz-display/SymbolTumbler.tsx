import { Select } from "@mantine/core";
import { useState } from "react";

interface SymbolTumblerProps {
  label: string;
  symbols: readonly string[];
  changeHandler: (selected: string) => void;
}

export const SymbolTumbler: React.FC<SymbolTumblerProps> = ({ symbols, label, changeHandler }) => {
  const mutableSymbols = [...symbols];
  return (<Select
    data={mutableSymbols}
    placeholder={'Select stock'}
    label={label}
    searchable
    clearable
    limit={20}
    onChange={changeHandler}
  />);
}
