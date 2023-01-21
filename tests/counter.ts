import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import { Keypair, SystemProgram } from "@solana/web3.js";
import {expect} from "chai";

describe("counter", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const signer = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Counter as Program<Counter>;

    let counter = Keypair.generate();

    const fetchCount = async () => {
        const counterProg = await program.account.counter.fetch(counter.publicKey);
        return counterProg.count.toNumber();
    }

    it("Create counter!", async () => {
        const tx = await program.methods.createCounter()
            .accounts({
                counter: counter.publicKey,
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([counter])
            .rpc();
        const count = await fetchCount();
        expect(count).to.equal(0);
    });

    it("Increment counter!", async () => {

        const tx = await program.methods.increment()
            .accounts({
                counter: counter.publicKey,
            })
            .rpc();
        console.log("Increment tx", tx);
        const count = await fetchCount();
        expect(count).to.equal(1);
    });

    it("Decrement counter!", async () => {
        const tx = await program.methods.decrement()
            .accounts({
                counter: counter.publicKey,
            })
            .rpc();
        const count = await fetchCount();
        expect(count).to.equal(0);
    });
});
