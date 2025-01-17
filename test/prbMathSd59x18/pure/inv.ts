import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import fp from "evm-fp";
import forEach from "mocha-each";

import { MAX_SD59x18, MAX_WHOLE_SD59x18, MIN_SD59x18, MIN_WHOLE_SD59x18, PI } from "../../../helpers/constants";
import { inv } from "../../../helpers/ethers.math";
import { bn } from "../../../helpers/numbers";
import { PanicCodes } from "../../shared/errors";

export default function shouldBehaveLikeInv(): void {
  context("when x is zero", function () {
    it("reverts", async function () {
      const x: BigNumber = bn("0");
      await expect(this.contracts.prbMathSd59x18.doInv(x)).to.be.revertedWith(PanicCodes.DivisionByZero);
      await expect(this.contracts.prbMathSd59x18Typed.doInv(x)).to.be.revertedWith(PanicCodes.DivisionByZero);
    });
  });

  context("when x is not zero", function () {
    context("when x is negative", function () {
      const testSets = [
        [fp(MIN_SD59x18)],
        [fp(MIN_WHOLE_SD59x18)],
        [fp("-1e18").sub(1)],
        [fp("-1e18")],
        [fp("-2503")],
        [fp("-772.05")],
        [fp("-100.135")],
        [fp("-22")],
        [fp("-4")],
        [fp(PI).mul(-1)],
        [fp("-2")],
        [fp("-1")],
        [fp("-0.1")],
        [fp("-0.05")],
        [fp("-1e-5")],
        [fp("-1e-18")],
      ];

      forEach(testSets).it("takes %e and returns the correct value", async function (x: BigNumber) {
        const expected: BigNumber = inv(x);
        expect(expected).to.equal(await this.contracts.prbMathSd59x18.doInv(x));
        expect(expected).to.equal(await this.contracts.prbMathSd59x18Typed.doInv(x));
      });
    });

    context("when x is positive", function () {
      const testSets = [
        [fp("1e-18")],
        [fp("1e-5")],
        [fp("0.05")],
        [fp("0.1")],
        [fp("1")],
        [fp("2")],
        [fp(PI)],
        [fp("4")],
        [fp("22")],
        [fp("100.135")],
        [fp("772.05")],
        [fp("2503")],
        [fp("1e18")],
        [fp("1e18").add(1)],
        [fp(MAX_WHOLE_SD59x18)],
        [fp(MAX_SD59x18)],
      ];

      forEach(testSets).it("takes %e and returns the correct value", async function (x: BigNumber) {
        const expected: BigNumber = inv(x);
        expect(expected).to.equal(await this.contracts.prbMathSd59x18.doInv(x));
        expect(expected).to.equal(await this.contracts.prbMathSd59x18Typed.doInv(x));
      });
    });
  });
}
