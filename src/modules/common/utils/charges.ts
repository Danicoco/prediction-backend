export const paystackCharge = {
    cardFunding: {
        fee: 0.02, // 0.5%
        maximum: 3000 // N3000 maximum
    },
    calculateFundingAmount: (amount: number) => {
        let charge = Number(amount) * paystackCharge.cardFunding.fee;
        if (charge > paystackCharge.cardFunding.maximum) charge = paystackCharge.cardFunding.maximum;
        if (Number(amount) >= 2500) charge = charge + 100;
        const totalFee = Number(amount) + charge;
        return { totalFee, charge };
    },
    removeFeeFromPayment: (amountPaid: number, charge: number) => {
        const deductInitialCharge = Number(amountPaid) - Number(charge);
        return deductInitialCharge;
    }
}

