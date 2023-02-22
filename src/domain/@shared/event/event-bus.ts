import EventDispatcher from "./event-dispatcher";
import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

// Event bus criado usando Singleton para garantir que a instancia do EventDispatcher usada ao notificar 
// o evento dentro do agregado seja a mesma instância utilizada para registrar os eventos 

export default class EventBus implements EventDispatcherInterface {
    private static _instance: EventBus = null;
    private static _dispatcher: EventDispatcher = new EventDispatcher();

    private EventBus(){}

    public static getInstance():EventBus {
        if (EventBus._instance == null)
            EventBus._instance = new EventBus();

        return EventBus._instance;
    }

    public notify(event: EventInterface): void{
        EventBus._dispatcher.notify(event);
    }

    public register(eventName: string, eventHandler: EventHandlerInterface): void{
        EventBus._dispatcher.register(eventName, eventHandler);
    }
    
    public unregister(eventName: string, eventHandler: EventHandlerInterface): void{
        EventBus._dispatcher.unregister(eventName, eventHandler);
    }

    public unregisterAll(): void {
        EventBus._dispatcher.unregisterAll();
    }

    public get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
        return EventBus._dispatcher.getEventHandlers;
      }
    }