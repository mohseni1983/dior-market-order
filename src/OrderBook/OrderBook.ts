import includes from 'lodash/includes';
import {Order, OrderParams, OrderTracker} from '../Order';
import {TradeBook} from '../TradeBook';
import {Trade} from '../Trade';
import {OrderModal} from '../Order/Order.modal';
export class OrderBook {
    instrument: string;
    marketPrice: number;
    tradeBook: TradeBook;
    orderModal: typeof OrderModal;
    activeOrders: Order[];
    bids: Order[];
    asks: Order[];
    orderTrackers: OrderTracker[];

    /**
     * makeComparator
     * FIFO - https://corporatefinanceinstitute.com/resources/knowledge/trading-investing/matching-orders/
     */
    public makeComparator() {
        /**
         
            factor := 1
            if priceReverse {
                factor = -1
            }
            return func(a, b OrderTracker) bool {
                if a.Type == TypeMarket && b.Type != TypeMarket {
                    return true
                } else if a.Type != TypeMarket && b.Type == TypeMarket {
                    return false
                } else if a.Type == TypeMarket && b.Type == TypeMarket {
                    return a.Timestamp < b.Timestamp // if both market order by time
                }
                priceCmp := a.Price - b.Price
                if priceCmp == 0 {
                    return a.Timestamp < b.Timestamp
                }
                if priceCmp < 0 {
                    return -1*factor == -1
                }
                return factor == -1
            }
         */
    }

    /**
     * Create a new OrderBook
     * @param instrument
     * @param marketPrice
     * @param tradeBook
     * @param orderModal
     */
    constructor(
        instrument: string,
        marketPrice: number,
        tradeBook: TradeBook,
        orderModal: typeof OrderModal
    ) {
        this.instrument = instrument;
        this.marketPrice = marketPrice;
        this.asks = []; // TODO restore
        this.bids = []; // TODO restore
        this.orderTrackers = [];
        this.activeOrders = [];
        this.orderModal = orderModal;
        this.tradeBook = tradeBook;
    }

    /**
     * getBids
     */
    public getBids() {}

    /**
     * getAsks
     */
    public getAsks() {}

    /**
     * getMarketPrice
     */
    public getMarketPrice() {}

    /**
     * setMarketPrice
     * @param price number
     */
    public setMarketPrice(price: number) {}

    /**
     * getActiveOrder
     * @param id string
     */
    public getActiveOrder(id: string): Order {
        return this.activeOrders.find((i) => i.id === id);
    }

    /**
     * setActiveOrder
     * @param order Order
     */
    public setActiveOrder(order: Order) {}

    /**
     * addToBook
     * @param order Order
     */
    public addToBook(order: Order) {
        /**
         var mutex *sync.RWMutex
        var oMap *orderMap

        if order.IsBid() {
            mutex = &o.bidMutex
            oMap = o.bids
        } else {
            mutex = &o.askMutex
            oMap = o.asks
        }
        price, err := order.Price.Float64() // might be really slow
        if err != nil {
            return err
        }
        tracker := OrderTracker{
            Price:     price,
            Timestamp: order.Timestamp.UnixNano(),
            OrderID:   order.ID,
            Type:      order.Type,
            Side:      order.Side,
        }

        mutex.Lock()
        defer mutex.Unlock()
        oMap.Set(tracker, true) // enter pointer to the tree
        if err := o.setOrderTracker(tracker); err != nil {
            return err
        }
        if err := o.setActiveOrder(order); err != nil {
            o.removeOrderTracker(order.ID)
            return err
        }
        return o.orderRepo.Save(order)
         */
    }

    /**
     * updateActiveOrder
     * @param order Order
     */
    public updateActiveOrder(order: Order) {}

    /**
     * removeFromBooks
     * @param id string
     */
    public removeFromBooks(id: string) {}

    /**
     * cancel
     * @param id string
     */
    public cancel(id: string) {}

    /**
     * getOrderTracker
     * @param orderId: string
     */
    public getOrderTracker(orderId: string) {}

    /**
     * setOrderTracker
     * @param tracker OrderTracker
     */
    public setOrderTracker(tracker: OrderTracker) {}

    /**
     * removeOrderTracker
     * @param orderId: string
     */
    public removeOrderTracker(orderId: string) {}

    /**
     * add
     * @param order Order
     */
    public add(order: Order) {
        /**
         	if order.Qty <= MinQty { // check the qty
                return false, ErrInvalidQty
            }
            if order.Type == TypeMarket && !order.Price.IsZero() {
                return false, ErrInvalidMarketPrice
            }
            if order.Type == TypeLimit && order.Price.IsZero() {
                return false, ErrInvalidLimitPrice
            }
            if order.Params.Is(ParamStop) && order.StopPrice.IsZero() {
                return false, ErrInvalidStopPrice
            }
            // todo: handle stop orders, currently ignored
            matched, err := o.submit(order)
            if err != nil {
                return matched, err
            }
            return matched, nilÎ
         */
    }

    /**
     * submit
     * @param order Order
     */
    public submit(order: Order) {
        // var matched bool
        // if order.IsBid() {
        //     // order is a bid, match with asks
        //     matched, _ = o.matchOrder(&order, o.asks)
        // } else {
        //     // order is an ask, match with bids
        //     matched, _ = o.matchOrder(&order, o.bids)
        // }
        // addToBooks := true
        // if order.Params.Is(ParamIOC) && !order.IsFilled() {
        //     order.Cancel()                                  // cancel the rest of the order
        //     if err := o.orderRepo.Save(order); err != nil { // store the order (not in the books)
        //         return matched, err
        //     }
        //     addToBooks = false // don't add the order to the books (keep it stored but not active)
        // }
        // if !order.IsFilled() && addToBooks {
        //     if err := o.addToBooks(order); err != nil {
        //         return matched, err
        //     }
        // }
        // return matched, nil
    }

    min = (q1: number, q2: number): number => {
        if (q1 <= q2) {
            return q1;
        }
        return q2;
    };

    /**
     * matchOrder
     * @param order Order
     * @param offers Order[]
     */
    public async matchOrder(order: Order, offers: Order[]) {
        let matched = false;
        let bidOrderId: string = null;
        let askOrderId: string = null;
        let buyer: string = null;
        let seller: string = null;
        const buying = order.isBid();

        if (buying) {
            buyer = order.clientId;
        } else {
            seller = order.clientId;
            askOrderId = order.id;
        }

        const currentAON = order.options && order.options.params;

        const removeOrders: string[] = [];
        // removeOrders := make([]uint64, 0)
        // defer func() {
        // 	for _, orderID := range removeOrders {
        // 		o.removeFromBooks(orderID)
        // 	}
        // }()
        // currentAON := order.Params.Is(ParamAON)

        for (const offer of offers) {
            const oppositeTracker = offer;
            const oppositeOrder = this.getActiveOrder(oppositeTracker.id);

            if (!oppositeOrder) {
                throw new Error('should NEVER happen - tracker exists but active order does not');
            }

            const oppositeAON = oppositeOrder.options && oppositeOrder.options.params;
            if (oppositeOrder.isCancelled()) {
                removeOrders.push(oppositeOrder.id); // mark order for removal
                continue; // don't match with this order
            }

            const qty = this.min(order.unfilledQty(), oppositeOrder.unfilledQty());

            if (currentAON && qty != order.unfilledQty()) {
                continue; // couldn't find a match - we require AON but couldn't fill the order in one trade
            }
            if (oppositeAON && qty != oppositeOrder.unfilledQty()) {
                continue; // couldn't find a match - other offer requires AON but our order can't fill it completely
            }

            let price = 0;

            /**
             * Case orderType
             */
            if (!oppositeOrder.type) {
                this.panicOnOrderType(oppositeOrder);
            }

            if (oppositeOrder.type === 'market') {
                continue; // two opposing market orders are usually forbidden (rejected) - continue matching
            }

            if (oppositeOrder.type === 'limit') {
                price = oppositeOrder.price; // crossing the spread
            }

            /**
             * Case typeLimit
             */

            const myPrice = order.price;

            if (buying) {
                if (oppositeOrder.type === 'limit') {
                    if (myPrice < oppositeOrder.price) {
                        matched = true;
                        return matched; // other prices are going to be even higher than our limit
                    } else {
                        // our bid is higher or equal to their ask - set price to myPrice
                        price = myPrice; // e.g. our bid is $20.10, their ask is $20 - trade executes at $20.10
                    }
                } else {
                    // we have a limit, they are selling at our price
                    price = myPrice;
                }
            } else {
                // we're selling
                if (oppositeOrder.type === 'limit') {
                    if (myPrice > oppositeOrder.price) {
                        matched = true;
                        return matched; // we can't match since our ask is higher than the best bid
                    } else {
                        price = oppositeOrder.price; // set price to their bid
                    }
                } else {
                    price = myPrice;
                }
            }

            if (buying) {
                seller = oppositeOrder.clientId;
                askOrderId = oppositeOrder.id;
            } else {
                buyer = oppositeOrder.clientId;
                bidOrderId = oppositeOrder.id;
            }

            order.filledQty += qty;
            oppositeOrder.filledQty += qty;

            const newTrade = new Trade({
                // TODO generate tradeId
                id: null,
                buyer,
                seller,
                instrument: order.instrument,
                qty,
                price,
                timestamp: Date.now(),
                date: new Date(),
                bidOrderId: bidOrderId,
                askOrderId: askOrderId,
            });

            this.tradeBook.enter(newTrade);

            this.setMarketPrice(price);

            matched = true;

            if (oppositeOrder.unfilledQty() === 0) {
                // if the other order is filled completely - remove it from the order book
                removeOrders.push(oppositeOrder.id);
            } else {
                this.updateActiveOrder(oppositeOrder);
                return matched;
            }
            if (order.isFilled()) {
                return matched;
            }
        }

        return true;
    }

    /**
     * panicOnOrderType
     * @param order Order
     */
    public panicOnOrderType(order: Order) {
        console.log(`order type ${order && order.id} not implemented`);
    }
}
