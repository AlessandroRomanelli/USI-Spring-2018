package exercise_3;

import java.math.BigDecimal;

class BankAccount {

	private BigDecimal amount;

	public BankAccount(BigDecimal amount) {
		this.amount = amount;
	}

	public void transferTo(BankAccount target, BigDecimal amount) {
		// Local variables for Postconditions check
		BigDecimal initialAmount = this.amount;
		BigDecimal initialTargetAmount = target.amount;
		// Invariants (2)
		assert target.amount.compareTo(BigDecimal.ZERO) != -1: "The target BankAccount must have a positive amount";
		assert this.amount.compareTo(BigDecimal.ZERO) != -1: "The current BankAccount must have a positive amount";
		// Preconditions (3)
		assert ((amount.compareTo(BigDecimal.ZERO)) != -1) && (amount.scale() == 2): "Amount to transfer must be positive and have two digits";
		assert this != target: "Transfer target cannot be the same as the origin";
		assert this.amount.compareTo(amount) != -1: "Cannot transfer more money that the BankAccount has";
		// Code
		this.amount = this.amount.subtract(amount);
		target.amount = target.amount.add(amount);
		// Invariants (2)
		assert target.amount.compareTo(BigDecimal.ZERO) != -1: "The target BankAccount must have a positive amount";
		assert this.amount.compareTo(BigDecimal.ZERO) != -1: "The current BankAccount must have a positive amount";
		// Postconditions (2)
		assert this.amount.add(amount).compareTo(initialAmount) == 0: "The money we transfered + the money we have must be equal to the money we originally had";
		assert target.amount.subtract(amount).compareTo(initialTargetAmount) == 0: "The money the target has - the money we transfered must be equal to the money it had";
	}

	public String toString() {
		return amount.toString();
	}
}