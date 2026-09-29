import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { RolesGuard } from '../../common/guard/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../../generated/prisma/enums.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Create a new product (Admin only)'
    })
    @ApiBody({
        type: CreateProductDto
    })
    @ApiResponse({
        status: 201,
        description: "Product created successfully",
        type: ProductResponseDto
    })
    @ApiResponse({
        status:409,
        description: "Sku already exists"
    })
    @ApiResponse({
        status:403,
        description: "Forbidden - Admin role required"
    })
    async create(@Body() createProductDto: CreateProductDto):Promise<ProductResponseDto>{
        return await this.productService.create(createProductDto);
    }

    @Get()
    @ApiOperation({
        summary: "Get all products with optional filters"
    })
    @ApiResponse({
        status:200,
        description: "List of products with pagination",
        schema: {
            properties : {
                data: {
                    type: "array",
                    items: { $ref: '#/components/schemas/ProductResponseDto' }
                },
                meta : {
                    type: "object",
                    properties:{
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                        totalPages: { type: "number" }
                    }
                }
            }
        }
    })
    async findAll(@Query() queryDto: QueryProductDto){
        return await this.productService.findAll(queryDto)
    }

    @Get(':id')
    @ApiOperation({
        summary: "Get product by id"
    })
    @ApiResponse({
        status:200,
        description: " Product details",
        type: ProductResponseDto
    })
    @ApiResponse({
        status:404,
        description: "Product not found"
    })
    async findOne(@Param('id') id:string):Promise<ProductResponseDto>{
        return await this.productService.findOne(id)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary : 'Update a product (Admin Only)'
    })
    @ApiBody({
        type: UpdateProductDto
    })
    @ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        type: ProductResponseDto
    })
    @ApiResponse({
        status: 404,
        description: "Product not found"
    })
    @ApiResponse({
        status:409,
        description: "Sku already exists"
    })
    async update(@Param('id') id:string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>{
        return this.productService.update(id, updateProductDto)
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary:'Update product stock (Admin Only)'
    })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                quantity: {
                    type : "number",
                    description : "Stock adjustment ( positive to add, negative to subtract )",
                    example: 10
                }
            },
            required : ['quantity']
        }
    })
    @ApiResponse({
        status: 200,
        description: "Stock updated successfully",
        type : ProductResponseDto
    })
    @ApiResponse({
        status: 400,
        description: "Insufficient stock"
    })
    @ApiResponse({
        status: 404,
        description: "Product not found"
    })
    async updateStock(@Param('id') id:string, @Body('quantity') quantity: number): Promise<ProductResponseDto>{
        return await this.productService.updateStock(id, quantity)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Delete product (Admin only)"
    })
    @ApiResponse({
        status: 200,
        description: "Product deleted successfully"
    })
    @ApiResponse({
        status: 404,
        description: "Product not found"
    })
    @ApiResponse({
        status: 400,
        description: "Cannot delete product in active orders"
    })
    async remove(@Param('id') id:string): Promise<{message:string}>{
        return await this.productService.remove(id)
    }

}
