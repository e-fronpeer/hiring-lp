// GASのエンドポイントURL（デプロイ後に置き換える必要があります）
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwKnHP2cLCVIHVFrftk5SeYMKj23W0OWGuQjFh_8-yfMMv80JhXGqkuxz-3rWOViHnHA/exec';

// フォーム送信処理
async function submitForm(event) {
    event.preventDefault();
    
    // フォーム要素の取得
    const form = document.getElementById('recruitmentForm');
    const formData = new FormData(form);
    
    // フォームデータの検証
    if (!validateForm(formData)) {
        return false;
    }
    
    // 送信ボタンを無効化
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    try {
        // フォームデータをオブジェクトに変換
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // GASにデータを送信
        const response = await fetch(GAS_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        });
        
        // 送信成功時の処理
        showMessage('送信が完了しました。担当者よりご連絡させていただきます。', 'success');
        
        // フォームをリセット
        form.reset();
        
        // 成功通知を表示
        const successNotification = document.createElement('div');
        successNotification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ease-in-out';
        successNotification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>送信が完了しました</span>
            </div>
        `;
        document.body.appendChild(successNotification);
        
        // 3秒後に通知を消す
        setTimeout(() => {
            successNotification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                successNotification.remove();
            }, 300);
        }, 3000);
        
    } catch (error) {
        // エラー時の処理
        console.error('Error:', error);
        showMessage('送信に失敗しました。時間をおいて再度お試しください。', 'error');
    } finally {
        // 送信ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.textContent = '送信する';
    }
    
    return false;
}

// フォームのバリデーション
function validateForm(formData) {
    const requiredFields = ['name', 'email', 'hours', 'frontend', 'backend'];
    
    for (const field of requiredFields) {
        if (!formData.get(field)) {
            showMessage('必須項目が入力されていません。', 'error');
            return false;
        }
    }
    
    // メールアドレスの形式チェック
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('有効なメールアドレスを入力してください。', 'error');
        return false;
    }
    
    return true;
}

// メッセージ表示
function showMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 新しいメッセージ要素を作成
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message p-4 rounded-md mb-4 ${
        type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`;
    messageDiv.textContent = message;
    
    // フォームの前にメッセージを挿入
    const form = document.getElementById('recruitmentForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // 5秒後にメッセージを消す
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
} 