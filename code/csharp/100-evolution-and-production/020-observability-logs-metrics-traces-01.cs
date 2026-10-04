// 别这么写：
logger.LogInformation($"Order {orderId} placed by user {userId} for {total}");

// 要这么写：
logger.LogInformation("Order placed. {OrderId} {UserId} {Total} {ItemCount}",
    orderId, userId, total, items.Count);
