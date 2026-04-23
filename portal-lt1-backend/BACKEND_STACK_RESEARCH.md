# Choosing the Back End Technology Stack

## Market Research (Free Options)

The following frameworks are free, production-capable, and suitable for REST APIs:

1. Node.js + Express
2. Node.js + Fastify
3. Python + Django REST Framework
4. Java + Spring Boot
5. .NET + ASP.NET Core Web API

## Competitor Comparison Criteria

For a fair comparison, the criteria below were used:

- Performance (throughput and latency)
- Learning curve and developer productivity
- Ecosystem/plugins/community size
- Validation and testing support
- Suitability for in-memory CRUD APIs

## Benchmark Snapshot

Source for framework-level benchmark families:
- [TechEmpower Framework Benchmarks](https://www.techempower.com/benchmarks/)
- [TechEmpower GitHub repository](https://github.com/TechEmpower/FrameworkBenchmarks)

Express/Fastify direct benchmark references:
- [Better Stack: Express vs Fastify](https://betterstack.com/community/guides/scaling-nodejs/fastify-express/)
- [Fastify Benchmarks repository](https://github.com/fastify/benchmarks)

| Stack | Typical Throughput Trend* | Validation Support | Testing Ergonomics | Learning Curve |
|---|---|---|---|---|
| Node.js + Express | Medium | Manual/3rd party | Excellent with Jest + Supertest | Low |
| Node.js + Fastify | High | Schema-first built-in patterns | Very good | Low-Medium |
| Django REST | Medium | Strong serializer validators | Very good | Medium |
| Spring Boot | Medium-High | Strong bean validation | Excellent (JUnit ecosystem) | Medium-High |
| ASP.NET Core | High | Strong model validation | Excellent (xUnit/NUnit) | Medium |

\* Exact values vary by hardware, test type, and middleware chain. The referenced benchmarks consistently show Fastify and ASP.NET Core among high-throughput options, while Express prioritizes simplicity and ecosystem maturity.

## Selected Stack and Justification

Selected stack: **Node.js + Express**

Why this choice is appropriate for this assignment:

1. The assignment requires basic CRUD + statistics endpoints quickly and clearly.
2. Express has minimal overhead and a very simple routing/middleware model.
3. It integrates cleanly with Jest + Supertest for high code coverage.
4. It supports strict server-side validation patterns without requiring a database.
5. It is ideal for an in-memory (RAM-only) implementation, exactly as required.

## Community Best Practices Followed in Implementation

- Layered separation (`routes` -> `services` -> `data`) so endpoints are separated from business logic.
- Full server-side validation for request payloads and pagination query params.
- Deterministic HTTP status codes (`200/201/204/400/404`).
- Pure in-memory storage only (no DB, no filesystem persistence).
- Automated test coverage for CRUD, validation, pagination, and statistics endpoints.
