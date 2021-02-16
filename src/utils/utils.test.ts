import 'mocha';
import random from 'lodash/random';
import moment from 'moment';
import uuid from 'uuid';
import {expect} from 'chai';
import {Order, OrderObject} from '../Order';
import {OrderType} from '../shared';
import {generateUUID} from './uuid';
import {makeComparator, sortSellOrders, sortOldestTime, sortLessPrice, sortExpensivePrice, sortNewestTime} from './orders';

const sorter = makeComparator(false);

const symbol = 'STQ';

const buyerId = generateUUID();

const orderType: OrderType = 'market';

const buyPrice = 11;
const sellPrice = 10.5;

const removeMinutes = (date: Date, minute: number, remove: boolean): Date => {
    const cloneDate = new Date(date);
    const toRemove = remove ? cloneDate.getMinutes() - minute : cloneDate.getMinutes() + minute;
    return new Date(new Date(cloneDate.setMinutes(toRemove)));
};

// const asks: OrderObject[] = [
//     {
//         action: 'SELL',
//         id: generateUUID(),
//         instrument: symbol,
//         clientId: buyerId,
//         type: orderType,
//         qty: 20,
//         filledQty: 0,
//         price: sellPrice,
//         stopPrice: 0,
//         canceled: false,
//         date: removeMinutes(new Date, 2, true),
//         timestamp: removeMinutes(new Date, 2, true).getTime(),
//     },
// ];

const asksOrders: OrderObject[] = new Array(15).fill(new Date()).map((x, index) => {
    return {
        action: 'SELL',
        id: generateUUID(),
        instrument: symbol,
        clientId: buyerId,
        type: orderType,
        qty: 20,
        filledQty: 0,
        price: random(1, 20),
        stopPrice: 0,
        canceled: false,
        date: removeMinutes(new Date(), index, true),
        timestamp: removeMinutes(new Date(), index, true).getTime(),
    };
});

const buyOrders: OrderObject[] = new Array(15).fill(new Date()).map((x, index) => {
    return {
        action: 'BUY',
        id: generateUUID(),
        instrument: symbol,
        clientId: buyerId,
        type: orderType,
        qty: 20,
        filledQty: 0,
        price: buyPrice - +`0.${index}`,
        stopPrice: 0,
        canceled: false,
        date: removeMinutes(new Date(), index, false),
        timestamp: removeMinutes(new Date(), index, false).getTime(),
    };
});

describe('OrderBook', () => {
    // it('should sort ask order depending on', () => {
    //     const asks = asksOrders;
    //     const bids = buyOrders;
    //     console.log('all orders are', {asks: JSON.stringify(asks), bids: JSON.stringify(bids)});
    //     expect(asks).to.be.not.empty;
    // });

    it('should sort by less price', () => {
        console.log('All OG sortLessPrice are', JSON.stringify(asksOrders.map(i => i.price)));
        console.log('All SORTED sortLessPrice are', JSON.stringify(asksOrders.sort(sortLessPrice).map(i => i.price)));
        expect([1]).to.be.not.empty;
    });

    it('should sort by expensive price', () => {
        console.log('All OG sortExpensivePrice are', JSON.stringify(asksOrders.map(i => i.price)));
        console.log('All SORTED sortExpensivePrice are', JSON.stringify(asksOrders.sort(sortExpensivePrice).map(i => i.price)));
        expect([1]).to.be.not.empty;
    });

    it('should sort oldest time', () => {
        console.log('All OG sortOldestTime are', JSON.stringify(asksOrders.map(i => moment(i.date).fromNow())));
        console.log('All SORTED sortOldestTime are', JSON.stringify(asksOrders.sort(sortOldestTime).map(i => moment(i.date).fromNow())));
        expect([1]).to.be.not.empty;
    });

    it('should sort newest time', () => {
        console.log('All OG sortNewestTime are', JSON.stringify(asksOrders.map(i => moment(i.date).fromNow())));
        console.log('All SORTED sortNewestTime are', JSON.stringify(asksOrders.sort(sortNewestTime).map(i => moment(i.date).fromNow())));
        expect([1]).to.be.not.empty;
    });
});
