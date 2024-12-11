"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/lib/currency/hooks";
import { SUPPORTED_CURRENCIES } from "@/lib/currency/constants";
import { parseCurrencyInput } from "@/lib/currency/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const currencyCode = useCurrency();
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  
  const [displayValue, setDisplayValue] = React.useState(() => 
    value.toFixed(currency.decimals)
  );

  React.useEffect(() => {
    setDisplayValue(value.toFixed(currency.decimals));
  }, [value, currency.decimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    const numericValue = parseCurrencyInput(newValue, currency);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    // Format the display value on blur
    setDisplayValue(value.toFixed(currency.decimals));
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {currency.symbol}
      </div>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="pl-7"
      />
    </div>
  );
}