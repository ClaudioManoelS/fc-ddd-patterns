import EventBus from "../../@shared/event/event-bus";
import Customer from "../entity/customer";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "./handler/send-console-log-1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "./handler/send-console-log-2-when-customer-is-created.handler";

describe("Customer created event tests", () => {
  
  it("should dispatch CustomerCreatedEvent when a customer is created", () => {
    const eventHandler1 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const eventHandler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    EventBus.getInstance().register("CustomerCreatedEvent", eventHandler1);
    EventBus.getInstance().register("CustomerCreatedEvent", eventHandler2);

    expect(
      EventBus.getInstance().getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(EventBus.getInstance().getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    expect(
      EventBus.getInstance().getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      EventBus.getInstance().getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);


    const customer = new Customer("111", "John");

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

});
