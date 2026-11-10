from django.test import TestCase
from assistant.models import KnowledgeDocument, KnowledgeChunk
from assistant.rag_engine import chunk_text, retrieve_relevant_chunks, query_rag_assistant

class RAGEngineTestCase(TestCase):
    def setUp(self):
        self.doc = KnowledgeDocument.objects.create(
            title="Python Concurrency Guide",
            source="Nexora Docs",
            content="Python concurrency utilizes asyncio, multiprocessing, and threading. The Global Interpreter Lock (GIL) serializes CPU-bound bytecode in CPython."
        )
        chunks = chunk_text(self.doc.content)
        for i, c in enumerate(chunks):
            KnowledgeChunk.objects.create(document=self.doc, chunk_text=c, chunk_index=i)

    def test_rag_retrieval(self):
        retrieved = retrieve_relevant_chunks("CPython GIL concurrency", top_k=2)
        self.assertGreater(len(retrieved), 0)
        self.assertEqual(retrieved[0]['document_title'], "Python Concurrency Guide")

    def test_assistant_query_grounding(self):
        res = query_rag_assistant("How does Python handle concurrency and GIL?")
        self.assertTrue(res['grounded'])
        self.assertGreater(len(res['sources']), 0)

