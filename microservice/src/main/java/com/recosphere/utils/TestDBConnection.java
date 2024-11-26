package com.recosphere.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

@Component
public class TestDBConnection implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    public TestDBConnection(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // Confirm the active database name
            String connectedDB = mongoTemplate.getDb().getName();
            System.out.println("Successfully connected to MongoDB Database: " + connectedDB);

            // List all collections in the connected database
            MongoDatabase database = mongoTemplate.getMongoDatabaseFactory().getMongoDatabase();
            System.out.println("Collections available in the database:");
            database.listCollectionNames().forEach(collectionName -> System.out.println("- " + collectionName));

            // Define the target collection name for the test
            String collectionName = "test_collection";

            // Insert a test document into the target collection
            MongoCollection<Document> collection = database.getCollection(collectionName);
            Document testDoc = new Document("name", "testUser")
                    .append("email", "testuser@example.com")
                    .append("status", "connected");
            collection.insertOne(testDoc);
            System.out.println("Inserted test document: " + testDoc.toJson());

            // Fetch the test document back and print it
            Document fetchedDoc = collection.find(new Document("name", "testUser")).first();
            if (fetchedDoc != null) {
                System.out.println("Fetched document from the database: " + fetchedDoc.toJson());
            } else {
                System.out.println("No document found with the specified criteria.");
            }
        } catch (Exception e) {
            System.err.println("Error while connecting to MongoDB or performing operations: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
