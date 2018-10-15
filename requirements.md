API Design Take Home Project

You are building a Marketplace for Freelancers and Project Managers. The Marketplace allows Project Managers to post Projects which prospective Freelancers can bid on to win a contract for that Project. The goal is to demonstrate how well you design and implement a system with limited requirements. This is an open-ended exercise. Feel free to modify the requirements to provide a better customer experience.

Design and Implement a REST or GraphQL API to support the following requirements:
Create a Project with at least the following fields: ID, Name, Owner, Description, Work Type (eg, frontend, backend, ux, sysadmin), Deadline, Maximum Budget (starting bid), Lowest Bid (defaults to null), and Lowest Bidder (defaults to null)

1. [X] Get a Project by ID
2. [X] Bid on a Project by ID
3. [-] Query for Projects based on Name (fuzzy match), Work Type, and where the Deadline has not yet passed

Not Required but nice to have:

1. [ ] Use of Code-Generation Frameworks
2. [ ] Authentication and Authorization (passing Username in the request for Create Project and Bid On Project is sufficient to limit the scope of this exercise)
3. [ ] Cloud native implementation
4. [X] Persistence to disk (using an In-memory database is sufficient)
5. [ ] Frontend

Expectations:

1. Limit your time on this task to about 1 hour. We don’t expect perfection. When your time is up, you can list things you would have liked to do given more time if that allows you to honor the time limit.
2. Push your implementation repo onto your personal Github at least 24 hours prior to the on-site interview and notify us.
3. Come to the on-site interview prepared to explain the rationale for your technology and design pattern choices.
