import EventBus from "../../@shared/event/event-bus";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "./handler/send-console-log-when-customer-address-is-changed.handler";

describe("Customer address changed event tests", () => {
  
   it("should dispatch CustomerAddressChangedEvent when a customer address is changed", () => {
    const eventHandler = new SendConsoleLogWhenCustomerAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    EventBus.getInstance().register("CustomerAddressChangedEvent", eventHandler);

    expect(
      EventBus.getInstance().getEventHandlers["CustomerAddressChangedEvent"]
    ).toBeDefined();
    expect(EventBus.getInstance().getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
      1
    );
    expect(
      EventBus.getInstance().getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);


    const customer = new Customer("111", "John");
    customer.Address = new Address("Rua Pio XI", 22, "05411-414", "São Paulo");

    const newAddress = new Address("Rua Nova", 33, "12345-678", "Recife");
    customer.changeAddress(newAddress)

    expect(spyEventHandler).toHaveBeenCalled();
   });
});
