## Overview
HW #3 Redis exercises basic building blocks forming infrastructure for web-scale applications particular around in-memory caches of recently accessed data where
it's acceptable to sacrifice some consistency for higher availability. 

Also, we covered other aspects of infrastructure such as load balancing, availability
zones, regions, and architectural patterns suchs Circuit Breaker and Bulkhead.

## Conceptual Questions
1. Describe three desirable properties for infrastructure.

Three of many desirable properties for infrastructure are:
- Available: No or limited interruption to provided services.

To ensure a particular service as highly available, multiple instances of a service
can be deployed. If the services are relatively stateless (or the state can be extracted 
out of the service itself and into another layer of the architecture), then it's possible
for any instance of a service to process a request, so that if one instance is no longer
available other instances are available to handle future requests.


- Scalable: Can increase specific units in response to demand.

In addition to increasing instances of services to handle increased demand, this also
includes decreasing instances of services when demand decreases.


- Efficient: Avoid redundant work, shift responsibility to low-cost components.

Avoiding redundant work can be implemented by dividing responsibilities across separate
services, and then deploy those services on the lowest cost components that still
satisfies the non-functional requirements of the system (e.g. using lower cost storage
or systems with fewer CPU cores and memory where not needed.)


2. Describe some benefits and issues related to using Load Balancers.

Some benefits of load balancers are scalability, redundancy, and flexibility. Load balancers can send traffic to healthy instances of services and automatically detect
when an instance is not healthy and remove that instance from the pool. Load balancers
can implement multiple strategies for distributing traffic such as round-robin or based
on resource usage.

Load balancers are useful for rolling deployments of new software. Service instances can be removed from the load balancer, upgraded, and then added back into the load balancer 
when ready all while the load balancer continues to route requests to available instances.

Load balancers must be very reliable and extremely performant so that they do not 
become the single point of failure or performance bottleneck of the system.

3. What are some reasons for keeping servers in seperate availability zones?

Some reasons for separating services into different availibility zones are availability and resiliency. In Amazon Web Services architectures, in most regions there are multiple availability zones so that if one availability zone becomes inaccessibile (e.g. power outage at a data center), the system can still be available by failing over to instances
physically located nearby in another availability zone. 

Many resources can be accessed directly in all availability zones within the same region. For example, co-located datacenters have fiber network connections directly to
the datacenters of all the availability zones within the same region.


4. Describe the Circuit Breaker and Bulkhead pattern.

The Circuit Breaker pattern is used to detect issues/failures within individual components of a system and prevents actions that are certain to fail. 

The Bulkhead pattern provides isolations between multiple components/services within
a system to help ensure that errors in one part of the system do not propagate to 
other parts of the system.

Often, these patterns are used in conjunction to ensure availability and resiliency.


## Evaluation
- [x] Complete task 1 30%
- [x] Complete task 2 50%
- [x] Complete task 3 75%
- [x] Complete task 4: 80%
- [x] Answer conceptual questions 100%
- [x] Complete task 5: 110%

## Screencast
