const { Firestore, FieldValue } = require('@google-cloud/firestore');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { onRequest } = require("firebase-functions/v2/https");

// --- Firestoreの初期化 ---
const firestore = new Firestore();
const propertiesCollection = firestore.collection('properties');

// --- CORSのハンドラ ---
// Expressミドルウェアの代わりに手動で呼び出す
const corsHandler = cors({ origin: true });

// --- ヘルパー関数: レビュー平均点の再計算 ---
const recalculateRating = async (propertyId) => {
    const propertyRef = propertiesCollection.doc(propertyId);
    const propertyDoc = await propertyRef.get();
    if (!propertyDoc.exists) return;
    
    const propertyData = propertyDoc.data();
    const reviews = propertyData.reviews || [];

    if (reviews.length === 0) {
        await propertyRef.update({ rating: 0 });
        return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    await propertyRef.update({ rating: newAverageRating });
};


// --- メインのAPIハンドラ関数 ---
const apiHandler = async (req, res) => {
    // Cloud Functionsが自動的にボディをパースしてくれる
    const { path, method, body } = req;

    try {
        // --- ルーティングロジック ---

        // GET /properties - 全ての施設を取得
        if (path === '/properties' && method === 'GET') {
            const snapshot = await propertiesCollection.get();
            const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(properties);
        }

        // --- /properties/:propertyId ---
        const propertyMatch = path.match(/^\/properties\/([^/]+)$/);
        if (propertyMatch) {
            const propertyId = propertyMatch[1];
            
            // PUT /properties/:propertyId - 施設を新規作成または更新
            if (method === 'PUT') {
                delete body.id;
                if (!body.name || !body.ownerUsername) {
                    return res.status(400).send('Missing required property fields.');
                }
                await propertiesCollection.doc(propertyId).set(body, { merge: true });
                const updatedDoc = await propertiesCollection.doc(propertyId).get();
                return res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
            }
            
            // DELETE /properties/:propertyId - 施設を削除
            if (method === 'DELETE') {
                const docRef = propertiesCollection.doc(propertyId);
                if (!(await docRef.get()).exists) {
                    return res.status(404).send('Property not found');
                }
                await docRef.delete();
                // 204の代わりに200とボディを返すことで、"Failed to fetch"の一因を回避
                return res.status(200).json({ success: true, id: propertyId });
            }
        }
        
        // --- /properties/:propertyId/reviews ---
        const reviewMatch = path.match(/^\/properties\/([^/]+)\/reviews$/);
        if (reviewMatch) {
            const propertyId = reviewMatch[1];
            // POST - レビューを追加
            if (method === 'POST') {
                const newReview = { ...body, id: `rev-${uuidv4()}` };
                const propertyRef = propertiesCollection.doc(propertyId);
                await propertyRef.update({ reviews: FieldValue.arrayUnion(newReview) });
                await recalculateRating(propertyId);
                const updatedDoc = await propertyRef.get();
                return res.status(201).json({ updatedProperty: { id: updatedDoc.id, ...updatedDoc.data() }, newReview });
            }
        }
        
        // --- /properties/:propertyId/reviews/:reviewId ---
        const reviewIdMatch = path.match(/^\/properties\/([^/]+)\/reviews\/([^/]+)$/);
        if (reviewIdMatch) {
            const [_, propertyId, reviewId] = reviewIdMatch;
            const propertyRef = propertiesCollection.doc(propertyId);
            const doc = await propertyRef.get();
            if (!doc.exists) return res.status(404).send('Property not found');
            
            const property = doc.data();
            const reviews = property.reviews || [];
            
            // PUT - レビューを更新
            if (method === 'PUT') {
                const reviewIndex = reviews.findIndex(r => r.id === reviewId);
                if (reviewIndex === -1) return res.status(404).send('Review not found');
                reviews[reviewIndex] = { ...reviews[reviewIndex], ...body };
                await propertyRef.update({ reviews });
                await recalculateRating(propertyId);
                const updatedDoc = await propertyRef.get();
                return res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
            }
            
            // DELETE - レビューを削除
            if (method === 'DELETE') {
                const updatedReviews = reviews.filter(r => r.id !== reviewId);
                await propertyRef.update({ reviews: updatedReviews });
                await recalculateRating(propertyId);
                const updatedDoc = await propertyRef.get();
                return res.status(200).json({ updatedProperty: { id: updatedDoc.id, ...updatedDoc.data() } });
            }
        }

        // --- /properties/:propertyId/announcements ---
        const announcementMatch = path.match(/^\/properties\/([^/]+)\/announcements$/);
        if (announcementMatch) {
             const propertyId = announcementMatch[1];
             // POST - お知らせを追加
             if (method === 'POST') {
                const newAnnouncement = { ...body, id: `ann-${uuidv4()}`, createdAt: new Date().toISOString() };
                const propertyRef = propertiesCollection.doc(propertyId);
                await propertyRef.update({ announcements: FieldValue.arrayUnion(newAnnouncement) });
                const updatedDoc = await propertyRef.get();
                return res.status(201).json({ id: updatedDoc.id, ...updatedDoc.data() });
             }
        }
        
        // --- /properties/:propertyId/announcements/:announcementId ---
        const announcementIdMatch = path.match(/^\/properties\/([^/]+)\/announcements\/([^/]+)$/);
        if (announcementIdMatch) {
            const [_, propertyId, announcementId] = announcementIdMatch;
            const propertyRef = propertiesCollection.doc(propertyId);
            const doc = await propertyRef.get();
            if (!doc.exists) return res.status(404).send('Property not found');

            const announcements = doc.data().announcements || [];

            // PUT - お知らせを更新
            if (method === 'PUT') {
                const index = announcements.findIndex(a => a.id === announcementId);
                if (index === -1) return res.status(404).send('Announcement not found');
                announcements[index] = { ...announcements[index], ...body };
                await propertyRef.update({ announcements });
                const updatedDoc = await propertyRef.get();
                return res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
            }

            // DELETE - お知らせを削除
            if (method === 'DELETE') {
                 const updatedAnnouncements = announcements.filter(a => a.id !== announcementId);
                 await propertyRef.update({ announcements: updatedAnnouncements });
                 const updatedDoc = await propertyRef.get();
                 return res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
            }
        }

        // 一致するルートがない場合
        return res.status(404).send('Not Found');

    } catch (error) {
        console.error("Unhandled API Error:", error);
        return res.status(500).send('Internal Server Error');
    }
};

// --- Cloud Functionとしてエクスポート ---
// CORSハンドラでapiHandlerをラップする
exports.api = onRequest((req, res) => {
    corsHandler(req, res, () => {
        apiHandler(req, res);
    });
});
