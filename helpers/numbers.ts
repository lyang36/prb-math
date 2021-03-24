import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Decimal } from "decimal.js";

export const UNIT = 1e18;

export function bn(x: BigNumberish | Decimal): BigNumber {
  if (BigNumber.isBigNumber(x)) {
    return x;
  }
  const stringified = parseScientific(x.toString());
  const integer = stringified.split(".")[0];
  return BigNumber.from(integer);
}

export function decimal(x: BigNumberish | Decimal): Decimal {
  return new Decimal(x.toString());
}

export function fp(x: number | Decimal): BigNumber {
  return bn(toFp(x));
}

export function toFp(x: BigNumberish | Decimal): Decimal {
  return decimal(x).mul(UNIT);
}

export function fromFp(x: BigNumberish | Decimal): Decimal {
  return decimal(x).div(UNIT);
}

function parseScientific(num: string): string {
  // If the number is not in scientific notation return it as it is.
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    return num;
  }

  // Remove the sign.
  const numberSign = Math.sign(Number(num));
  num = Math.abs(Number(num)).toString();

  // Parse into coefficient and exponent.
  const [coefficient, exponent] = num.toLowerCase().split("e");
  let zeros = Math.abs(Number(exponent));
  const exponentSign = Math.sign(Number(exponent));
  const [integer, decimals] = (coefficient.indexOf(".") != -1 ? coefficient : `${coefficient}.`).split(".");

  if (exponentSign === -1) {
    zeros -= integer.length;
    num =
      zeros < 0
        ? integer.slice(0, zeros) + "." + integer.slice(zeros) + decimals
        : "0." + "0".repeat(zeros) + integer + decimals;
  } else {
    if (decimals) zeros -= decimals.length;
    num =
      zeros < 0
        ? integer + decimals.slice(0, zeros) + "." + decimals.slice(zeros)
        : integer + decimals + "0".repeat(zeros);
  }

  return numberSign < 0 ? "-" + num : num;
}