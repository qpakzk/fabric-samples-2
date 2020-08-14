'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async mint(ctx, id, type, owner, xattr, uri) {
        console.info('============= START : mint ===========');

        const token = {
            id,
            type,
            owner,
            approvee: '',
            xattr: JSON.parse(xattr),
            uri: JSON.parse(uri),
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(token)));
        console.info('============= END : mint ===========');
    }

    async ownerOf(ctx, id) {
        const tokenAsBytes = await ctx.stub.getState(id);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }

        const token = JSON.parse(tokenAsBytes.toString());

        return token.owner;
    }

    async transferFrom(ctx, from, to, id) {
        console.info('============= START : transferFrom ===========');

        const tokenAsBytes = await ctx.stub.getState(id);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }

        const token = JSON.parse(tokenAsBytes.toString());

        if (token.owner !== from) {
            throw new Error(`${from} is not an owner of the token`);
        }

        token.owner = to;
        token.approvee = '';

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(token)));
        console.info('============= END : transferFrom ===========');
    }

    async query(ctx, id) {
        const tokenAsBytes = await ctx.stub.getState(id);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        
        return tokenAsBytes.toString();
    }

    async getXAttr(ctx, id, index) {
        const tokenAsBytes = await ctx.stub.getState(id);
        if (!tokenAsBytes || tokenAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }

        const token = JSON.parse(tokenAsBytes.toString());
        return token.xattr[index];
    }
}

module.exports = FabCar;
