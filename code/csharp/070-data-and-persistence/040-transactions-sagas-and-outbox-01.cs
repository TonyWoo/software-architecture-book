// 编排式 saga：流程顺序和补偿计划住在同一个地方。
public sealed class PlaceOrderSaga
{
    private readonly IPaymentService _payments;
    private readonly IInventoryService _inventory;
    private readonly IShippingService _shipping;
    private readonly SagaState _state = new();

    public PlaceOrderSaga(
        IPaymentService payments,
        IInventoryService inventory,
        IShippingService shipping)
    {
        _payments = payments;
        _inventory = inventory;
        _shipping = shipping;
    }

    public async Task<Result> ExecuteAsync(Order order, CancellationToken ct)
    {
        _state.PaymentId = await _payments.ChargeAsync(order.Total, ct);
        try
        {
            _state.ReservationId = await _inventory.ReserveAsync(order.Lines, ct);
            try
            {
                _state.ShipmentId = await _shipping.BookLabelAsync(order, ct);
                return Result.Ok();
            }
            catch
            {
                await _inventory.ReleaseAsync(_state.ReservationId, ct);
                throw;
            }
        }
        catch
        {
            await _payments.RefundAsync(_state.PaymentId, ct);
            throw;
        }
    }

    private sealed class SagaState
    {
        public Guid PaymentId { get; set; }
        public Guid ReservationId { get; set; }
        public Guid ShipmentId { get; set; }
    }
}
